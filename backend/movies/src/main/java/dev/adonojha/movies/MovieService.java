package dev.adonojha.movies;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> allMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        return movieRepository.findMovieByImdbId(imdbId);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${TMDB_API_KEY}")
    private String tmdb_key;


    // New method to fetch and create a movie from TMDB API
    // DEBUG THIS FUNCTION, always goes into catch block
    public Movie fetchAndCreateMovie(String tmdbId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        // Construct the URLs needed to fetch data from TMDB API
        String basicInfoUrl = "https://api.themoviedb.org/3/movie/" + tmdbId + "?api_key=" + tmdb_key;
        String externalIdsUrl = basicInfoUrl + "&append_to_response=external_ids,videos";
        String imagesUrl = "https://api.themoviedb.org/3/movie/" + tmdbId + "/images?api_key=" + tmdb_key + "&language=en-US&include_image_language=null";

        String title = "";
        String releaseDate = "";
        String poster = "";
        String overview = "";
        String imdbId = "";
        String trailerLink = "";
        List<String> genres = new ArrayList<>();
        List<String> backdrops = new ArrayList<>();

        try {
            // Fetch basic movie info
            ResponseEntity<String> basicInfoResponse = restTemplate.getForEntity(basicInfoUrl, String.class);
            if (basicInfoResponse.getStatusCode() == HttpStatus.OK) {
                String json = basicInfoResponse.getBody();
                JSONObject jsonObject = new JSONObject(json);
                title = jsonObject.getString("original_title");
                releaseDate = jsonObject.getString("release_date");
                poster = "https://image.tmdb.org/t/p/w500" + jsonObject.getString("poster_path");
                overview = jsonObject.getString("overview");
            }

            // Fetch external IDs and videos
            String trailerKey = "";
            ResponseEntity<String> externalIdsResponse = restTemplate.getForEntity(externalIdsUrl, String.class);
            if (externalIdsResponse.getStatusCode() == HttpStatus.OK) {
                String json2 = externalIdsResponse.getBody();
                JSONObject externalIdsJSON = new JSONObject(json2);

                // IMDB ID
                imdbId = externalIdsJSON.getString("imdb_id");

                // First, check if the movie already exists
                Optional<Movie> existingMovie = movieRepository.findMovieByImdbId(imdbId);
                if (existingMovie.isPresent()) {
                    throw new Exception("Movie already exists in the database.");
                }

                // Trailer link
                JSONArray results = externalIdsJSON.getJSONObject("videos").getJSONArray("results");

                // DEBUGGING: Doesn't reach here
                for (int i = 0; i < results.length(); i++) {
                    JSONObject video = results.getJSONObject(i);
                    if ("Trailer".equals(video.getString("type"))) {
                        trailerKey = video.getString("key");
                        break;
                    }
                }
                trailerLink = "https://youtube.com/watch?v=" + trailerKey;

                // Genres
                JSONArray genresJSON = externalIdsJSON.getJSONArray("genres");

                for (int i = 0; i < genresJSON.length(); i++) {
                    JSONObject genre = genresJSON.getJSONObject(i);
                    genres.add(genre.getString("name"));
                }
            }

            // Fetch backdrops
            ResponseEntity<String> imagesResponse = restTemplate.getForEntity(imagesUrl, String.class);
            if (imagesResponse.getStatusCode() == HttpStatus.OK) {
                String json3 = imagesResponse.getBody();
                JSONObject imagesJSON = new JSONObject(json3);
                JSONArray backdropsJSON = imagesJSON.getJSONArray("backdrops");

                for (int i = 0; i < backdropsJSON.length(); i++) {
                    JSONObject backdrop = backdropsJSON.getJSONObject(i);
                    backdrops.add("https://image.tmdb.org/t/p/original" + backdrop.getString("file_path"));
                }
            }

            List<Review> reviewIds = new ArrayList<Review>();

            // Save the movie object to the database
            return movieRepository.save(new Movie(imdbId, title, releaseDate, trailerLink, poster, genres, backdrops, overview, reviewIds));
        } 

        catch (Exception e) {
            throw new RuntimeException("Failed to fetch movie data in Service", e);
        }
    }

    public Movie createMovie(String imdbId, String title, String releaseDate, String trailerLink,
                             String poster, List<String> genres, List<String> backdrops, String overview,
                             List<Review> reviewIds) {
        Movie movie = movieRepository.insert(new Movie(imdbId, title, releaseDate, trailerLink, poster, genres, backdrops, overview, reviewIds));

//        Save movie to database, return saved object
        return movieRepository.insert(movie);
    }
}
