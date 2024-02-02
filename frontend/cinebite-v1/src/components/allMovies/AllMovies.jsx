import './AllMovies.css';
import {Link, useNavigate} from "react-router-dom";
import { Col, Row } from 'react-bootstrap';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../reviews/Reviews';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AllMovies = ({movies}) => {

  // console.log(searchQuery);
  const navigate = useNavigate();

  const reviews = (movieId) => {
    navigate(`/Reviews/${movieId}`);
  }

  const request = () => {
    navigate(`/RequestMovie`);
  }

  return (
    <div className="movie-grid">
      <div className='greeting'>
        <div>Don't see a movie you want to leave a review on? Help contribute to the site and&nbsp;
          <span 
            className='link-to-request'
            onClick={() => request()}>request a movie!</span>
            <FontAwesomeIcon icon={faArrowRight} className='arrow'/>
        </div>
      </div>

      <Row>
        {
          movies?.sort((a, b) => a.title.localeCompare(b.title)).map((movie) => (       // Sorting movies from A-Z
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


export default AllMovies