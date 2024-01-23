package dev.adonojha.movies;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {
//    Create method that lets you access movie by its IMDB id
    Optional<Movie> findMovieByImdbId(String imdbId);
}
