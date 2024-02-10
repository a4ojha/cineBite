import '../allMovies/AllMovies.css';
import {Link, useNavigate} from "react-router-dom";
import { Col, Row } from 'react-bootstrap';
import Reviews from '../reviews/Reviews';
import { faArrowRight, faFireFlameCurved, faArrowDownAZ, faClockRotateLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import loadingGif from '../loading.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState } from 'react';
import React from 'react';

const Search = ({movies}) => {
  const [sortMethod, setSortMethod] = useState('Latest - Oldest'); // Default sort by latest movies first
  const [genreSelection, setGenreSelection] = useState('');
  const genres = ['', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'];

  const sortedMovies = React.useMemo(() => {
    if (!movies) return [];

    if (sortMethod === 'A-Z') {
      return [...movies]
        .filter(movie => genreSelection === "" || movie?.genres.includes(genreSelection))
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
  };

  // console.log(searchQuery);
  const navigate = useNavigate();

  const reviews = (movieId) => {
    navigate(`/reviews/${movieId}`);
  }

  const request = () => {
    navigate(`/request`);
  }

  const url = window.location.href;
  const lastSlashIndex = url.lastIndexOf('/');
  const searchQuery = (url.substring(lastSlashIndex + 1)).replace(/%20/g, ' ');

  if (typeof movies == "undefined") {
    return <div className='loading'>
      <img src={loadingGif} className='loading-gif'/>
      <p className='loading-text'>loading...</p>
    </div>  
  }

  return (
    <div className="movie-grid">
        <div className='top-bar'>
          <div className='dropdowns'>
            <div className="genre-dropdown">
              <Dropdown onSelect={handleGenreSelection}>
                <Dropdown.Toggle variant="dark" id="sort-dropdown">
                  Genre{genreSelection != "" ? ": " + genreSelection : ""}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    genres.map((genre) => (
                      <Dropdown.Item eventKey={genre} className={genreSelection == "Action" ? "selected-dropdown-item" : "dropdown-item"}>
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
      <Row>
        {sortedMovies?.length > 0 && sortedMovies.map((movie) => {
          // Check if the movie title matches the search query
          if (movie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return (
              <Col xs={4} sm={4} md={4} lg={2} key={movie.imdbId}>
                <div className='movie-preview'>
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    onClick={() => reviews(movie.imdbId)} 
                    className='img-fluid'
                  />
                  <span className="movie-title">{movie.title}</span>
                  <span id='release-year'>({movie.releaseDate.substring(0, 4)})</span>
                </div>
              </Col>
            );
          }
          return null; // Return null for movies that do not match the search query
        })}
        {movies?.length > 0 && !movies.some(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase())) && (
          <Col>
            <div className="no-movies" style={{marginBottom: '10px'}}>Your search "{searchQuery}" has no results.</div>
            <div className='greeting'>
              <div>Are we missing peak cinema? Help contribute to the site and&nbsp;
                <span 
                  className='link-to-request'
                  onClick={() => request()}>request a movie!</span>
                  <FontAwesomeIcon icon={faArrowRight} className='arrow'/>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}


export default Search