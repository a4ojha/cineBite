package dev.adonojha.movies;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

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

    public Movie createMovie(String imdbId, String title, String releaseDate, String trailerLink,
                             String poster, List<String> genres, List<String> backdrops, String overview,
                             List<Review> reviewIds) {
        Movie movie = movieRepository.insert(new Movie(imdbId, title, releaseDate, trailerLink, poster, genres, backdrops, overview, reviewIds));

//        Save movie to database, return saved object
        return movieRepository.insert(movie);
    }
}
