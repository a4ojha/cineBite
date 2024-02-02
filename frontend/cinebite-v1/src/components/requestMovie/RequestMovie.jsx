import './requestMovie.css';
import '../allMovies/AllMovies.css'
import {Link, useNavigate} from "react-router-dom";
import { Col, Row, Form, FormControl, Button } from 'react-bootstrap';
import Reviews from '../reviews/Reviews';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const RequestMovie = ({movies}) => {

  const handleSubmit = async (event) => {
    event.preventDefault();

  };

  return (
    <div className='request-container'>
      <div className="text-center mb-3">
        <p>*coming soon*</p>
        <p>What movie would you like to add to cineBite?</p>
      </div>
      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <FormControl
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
    
  );
}


export default RequestMovie