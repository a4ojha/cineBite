import './AllMovies.css';
import '../hero/Hero.css';

import {Link, useNavigate} from "react-router-dom";
import { Col, Row } from 'react-bootstrap';
import { faArrowRight, faFireFlameCurved, faArrowDownAZ, faClockRotateLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loadingGif from '../loading.gif'

import React, { useState } from 'react';

const AllMovies = ({movies}) => {
  const [sortMethod, setSortMethod] = useState('Latest - Oldest'); // Default sort by latest movies first
  const [genreSelection, setGenreSelection] = useState('');
  const genres = ['', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western']

  const sortedMovies = React.useMemo(() => {
    if (!movies) return [];

    if (sortMethod === 'A-Z') {
      return [...movies]
        .filter(movie => genreSelection === "" || movie.genres.includes(genreSelection))
        .sort((a, b) => a.title.localeCompare(b.title));
    } 
    else if (sortMethod === 'Most Reviews') {
      return [...movies]
        .filter(movie => genreSelection === "" || movie.genres.includes(genreSelection))
        .sort((a, b) => b.reviewIds.length - a.reviewIds.length);
    }
    else if (sortMethod === 'Latest - Oldest') {
      return [...movies]
        .filter(movie => genreSelection === "" || movie.genres.includes(genreSelection))
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }
    else if (sortMethod === 'Oldest - Latest') {
      return [...movies]
        .filter(movie => genreSelection === "" || movie.genres.includes(genreSelection))
        .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    }
  }, [movies, sortMethod, genreSelection]);

  const handleSelect = (eventKey) => {
    setSortMethod(eventKey);
  };

  const handleGenreSelection = (eventKey) => {
    setGenreSelection(eventKey);
    console.log("genre: " + genreSelection)
  };

  const navigate = useNavigate();

  const reviews = (movieId) => {
    navigate(`/reviews/${movieId}`);
  }

  const request = () => {
    navigate(`/request`);
  }

  if (typeof movies == "undefined") {
    return  <div className='loading'>
              <img src={loadingGif} className='loading-gif'/>
              <p className='loading-text'>loading...</p>
            </div>  
  }

  return (
    <div className="movie-grid">
      <div className='top-bar'>
        <div className='greeting'>
          <div>Don't see a movie you'd like to leave a review on? Help contribute to the site and&nbsp;
            <span 
              className='link-to-request'
              onClick={() => request()}>request a movie!</span>
              <FontAwesomeIcon icon={faArrowRight} className='arrow'/>
          </div>
        </div>

        <div className='dropdowns'>
          <div className="genre-dropdown">
            <Dropdown onSelect={handleGenreSelection}>              
              <Dropdown.Toggle variant="dark" id="sort-dropdown">
                Genre{genreSelection != "" ? ": " + genreSelection : ""}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  genres.map((genre) => (
                    <Dropdown.Item eventKey={genre} className={genreSelection == genre ? "selected-dropdown-item" : "dropdown-item"}>
                      {genre == '' ? 'All Movies' : genre}
                    </Dropdown.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="sort-dropdown">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle variant="dark" className="sort-dropdown">
                Sort by: {sortMethod}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Most Reviews" className={sortMethod == "Most Reviews" ? "selected-dropdown-item" : "dropdown-item"}>
                <FontAwesomeIcon icon={faFireFlameCurved} color='darkorange' style={{ marginRight: '16px'}}/>
                  Most Reviews</Dropdown.Item>
                <Dropdown.Item eventKey="Latest - Oldest" className={sortMethod == "Latest - Oldest" ? "selected-dropdown-item" : "dropdown-item"}>
                  <FontAwesomeIcon icon={faStar} color='green' style={{ marginRight: '10px'}}/>
                  Latest - Oldest</Dropdown.Item>
                <Dropdown.Item eventKey="Oldest - Latest" className={sortMethod == "Oldest - Latest" ? "selected-dropdown-item" : "dropdown-item"}>
                  <FontAwesomeIcon icon={faClockRotateLeft} color='red' style={{ marginRight: '12px'}}/>
                  Oldest - Latest</Dropdown.Item>
                <Dropdown.Item eventKey="A-Z" className={sortMethod == "A-Z" ? "selected-dropdown-item" : "dropdown-item"}>
                  <FontAwesomeIcon icon={faArrowDownAZ} color='darkblue' style={{ marginRight: '10px'}}/>
                  A-Z</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <hr />
      <Row>
        {
          sortedMovies?.map((movie) => (       // Sorting movies from A-Z
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