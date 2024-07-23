import './Hero.css';
import '../reviews/Reviews.css';
import Carousel from 'react-material-ui-carousel';
import {Paper} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import loadingGif from '../loading.gif'

const Hero = ({movies}) => {
    const [randomMovies, setRandomMovies] = useState([]);

    const navigate = useNavigate();

    const reviews = (movieId) => {
      navigate(`/reviews/${movieId}`);
    }

    const shuffleArray = (array, n) => {
      let selectedElements = [];
      let indicesSelected = new Set();
    
      while (selectedElements.length < n) {
        let index = Math.floor(Math.random() * array.length);
        if (!indicesSelected.has(index)) {
          indicesSelected.add(index);
          selectedElements.push(array[index]);
        }
      }
    
      return selectedElements;
    };

    const numMovies = 10;

    useEffect(() => {
      if (Array.isArray(movies) && movies.length) {
        const shuffledMovies = shuffleArray(movies, numMovies);
        setRandomMovies(shuffledMovies)
      }
    }, [movies]);

    if (typeof movies == "undefined") {
      return <div className='loading'>
        <img src={loadingGif} className='loading-gif'/>
        <p className='loading-text'>loading...</p>
      </div>
    }
    
  return (
    <div className="blur-effect animate-on-load">
      <Carousel>
        {
          randomMovies?.map((movie) => {
            
            var backdrop_index = (movie) => {
              return Math.floor(Math.random() * (movie.backdrops.length));
            }

            return (
              <Paper key={movie.imdbId}>
                <div className='movie-card-container'>
                  <div className='movie-card' style={{"--img": `url(${movie.backdrops[backdrop_index(movie)]})`}}>
                    <div className='movie-detail'>
                      <div className='movie-poster'>
                        <img src={movie.poster} alt="" />
                      </div>
                      <div className='movie-title'>
                        <h4>{movie.title}</h4>
                        <div className='movie-review-button-container'>
                          <Button variant="dark" onClick={() => reviews(movie.imdbId)} >Reviews</Button>
                        </div>
                      </div>

                      {!movie?.trailerLink.endsWith("watch?v=") && (
                        <Link to={`/trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                          <div className='play-button-icon-container' title='Watch Trailer'>
                            <FontAwesomeIcon className='play-button-icon'
                              icon={faCirclePlay}
                            />
                          </div>
                        </Link>
                      )}

                    </div>
                  </div>
                </div>
              </Paper>
            )
          })
        }
      </Carousel>
    </div>
  )
}

export default Hero