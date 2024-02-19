package dev.adonojha.movies;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;


import java.util.List;
import java.util.Map;
import java.util.Map;
import java.util.Optional;


// Rest API Controller
// All this is doing is using a service class, fetching all movies from the database, and giving them back to the API layer

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @Value("${TMDB_API_KEY}")
    private String tmdb_key;

    // Debugging
    @GetMapping("/debugging/get-tmdb-key")
    public String getApiKey() {
        return "TMDB API key: " + tmdb_key;
    }

//    Searches TMDB given a query String, returns JSON list of movie objects
    @GetMapping("/searchTMDB")
    public String searchMovie(@RequestParam String query) {
        String formattedQuery = query.replace(" ", "+");
        String url = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdb_key + "&query=" + formattedQuery;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            JSONObject jsonObj = new JSONObject(response.getBody());
            return jsonObj.getJSONArray("results").toString();
        } else {
            return "Error fetching movie data";
        }
    }

//    Creates a movie given a proper cineBite movie JSON, and adds to database
    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody Map<String, Object> payload) {
        // Extracting movie details from the payload
        String imdbId = (String) payload.get("imdbId");
        String title = (String) payload.get("title");
        String releaseDate = (String) payload.get("releaseDate");
        String trailerLink = (String) payload.get("trailerLink");
        String poster = (String) payload.get("poster");
        List<String> genres = (List<String>) payload.get("genres");
        List<String> backdrops = (List<String>) payload.get("backdrops");
        String overview = (String) payload.get("overview");
        List<Review> reviewIds = (List<Review>) payload.get("reviewIds");

        // Creating a new movie
        Movie createdMovie = movieService.createMovie(imdbId, title, releaseDate, trailerLink, poster, genres, backdrops, overview, reviewIds);

        // Returning the created movie
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    @PostMapping("/createFromTMDB/{tmdbId}")
    public ResponseEntity<?> createMovieFromTMDB(@PathVariable String tmdbId) {
        try {
            Movie movie = movieService.fetchAndCreateMovie(tmdbId);
            return new ResponseEntity<>(movie, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies(), HttpStatus.OK);
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable String imdbId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(imdbId), HttpStatus.OK);
    }

}
