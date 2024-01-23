import '../allMovies/AllMovies.css';
import {Link, useNavigate} from "react-router-dom";
import { Col, Row } from 'react-bootstrap';
import Reviews from '../reviews/Reviews';

import React from 'react';

const Search = ({movies}) => {

  // console.log(searchQuery);
  const navigate = useNavigate();

  const reviews = (movieId) => {
    navigate(`/Reviews/${movieId}`);
  }

  const url = window.location.href;
  const lastSlashIndex = url.lastIndexOf('/');
  const searchQuery = (url.substring(lastSlashIndex + 1)).replace('%20', ' ');

  return (
    <div className="movie-grid">
      <Row>
        {
          movies?.map((movie) => (
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            <Col xs={4} sm={4} md={4} lg={2} key={movie.imdbId}>
              <div className='movie-preview'>
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  onClick={() => reviews(movie.imdbId)} 
                  className='img-fluid'
                />
                <span className="movie-title">{movie.title}</span>
                <span id='release-year'>({movie?.releaseDate.substring(0, 4)})</span>
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  );
}


export default Search