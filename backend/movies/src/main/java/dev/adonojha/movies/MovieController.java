package dev.adonojha.movies;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies(), HttpStatus.OK);
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<Optional<Movie>> getSingleMovie(@PathVariable String imdbId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(imdbId), HttpStatus.OK);
    }

}
