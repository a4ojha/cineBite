import './requestMovie.css';
import api from '../../api/axiosConfig';
import {Link, useNavigate} from "react-router-dom";
import { Modal, Button, Form, FormControl, Col, Row } from 'react-bootstrap';
import Reviews from '../reviews/Reviews';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import React from 'react';
import imgFailed from '../../no_image.png'
import loadingGif from '../loading.gif'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from './collage.jpg'


const RequestMovie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
  const [selectedMovie, setSelectedMovie] = useState(null); // State to hold the movie to be added
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleImageError = (event) => {
    // Set to a default image if the original image fails to load
    event.target.src = imgFailed;
  };

  const getSearchResults = async () => {
    const url = `api/v1/movies/searchTMDB?query=${searchQuery}`;

    try {
      const response = await api.get(url);
      setSearchResults(response.data);
    }
    catch (error) {
      console.log("Error fetching movie search data", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // What happens when search button is pressed:
    if (!searchQuery.trim()) return; // Prevents empty queries
    getSearchResults();
  };

  const handleClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  }

  const handleConfirmAdd = async (tmdbId) => {
    setIsSubmitting(true); // Disable the add button
    const url = `/api/v1/movies/createFromTMDB/${tmdbId}`
    try {
      const response = await api.post(url);
      toast.success(`"${selectedMovie.original_title}" has been successfully added! Refresh page and search!`);
    }
    catch (error) {
      console.error("Error adding movie:", error.response ? error.response.data : error.message);
      toast.error(`"${selectedMovie.original_title}" already exists or another error occurred.`);
    }
    finally {
      setIsSubmitting(false); // Re-enable the button after request completion
    }
    setShowModal(false); // Close the modal
  };

  const bgStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1) 100%), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: '0.5',
  }

  return (
    // add style={bgStyle} for collage background (fix requestMovie.css if you do this)
    <div className="blur-effect animate-on-load">
    <div className='all-content'>
      <ToastContainer />
    <div className='request-container'>
      <div className="text-center mb-3">
        <p>What movie would you like to add to cineBite? Search from 950,000+ movies</p>
      </div>
      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <FormControl
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Enter any movie"
            className="me-2" // me-2 is for margin-end
            aria-label="Search"
          />
          <Button variant="outline-success" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>
      </div>
    </div>
      
      <Col>
      { 
        searchResults
          .slice() // Create a shallow copy of the array to avoid mutating the original array
          .sort((a, b) => b.popularity - a.popularity) // Sort in decreasing order of popularity
          .map((movie) => {

          if (typeof searchResults == "undefined") {
            // console.log("no results");
            return  <div className='loading'>
                      <img src={loadingGif} className='loading-gif'/>
                      <p className='loading-text'>loading...</p>
                    </div>  
          }

          // console.log(searchResults)
          if (Object.keys(searchResults).length == 0) {
            return <div>No results</div>
          }

          return (
            <div className="blur-effect animate-on-load">
            <div className='search-movie-item'
                title={`Add ${movie.title}`}
                onClick={() => handleClick(movie)}
            >
              <div className='search-movie-poster'>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title} 
                  onError={handleImageError}
                />
              </div>
              <div className='search-movie-info'>
                <h5 style={{ fontWeight: '700' }}>{movie.original_title} <span style={{ color: 'grey' }}>({movie.release_date.substring(0,4)})</span></h5>
                <p>{movie.overview}</p>
              </div>
          </div>
          </div>
          )
        })
      }
      </Col>
      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add "{selectedMovie?.original_title} ({selectedMovie?.release_date.substring(0,4)})" to cineBite?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleConfirmAdd(selectedMovie?.id)} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Movie'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
    
  );
}


export default RequestMovie