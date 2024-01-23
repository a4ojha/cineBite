import './Hero.css';
import Carousel from 'react-material-ui-carousel';
import {Paper} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';

const Hero = ({movies}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [randomMovies, setRandomMovies] = useState([]);

    const navigate = useNavigate();

    const reviews = (movieId) => {
      navigate(`/Reviews/${movieId}`);
    }

    const shuffleArray = (array, size) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
      }
      return shuffled.slice(0, size);
    };

    const numMovies = 10;

    useEffect(() => {
      if (Array.isArray(movies) && movies.length) {
        const shuffledMovies = shuffleArray(movies, numMovies);
        setRandomMovies(shuffledMovies)
      }
      setIsLoading(false);
    }, [movies]);

    if (isLoading) {
      return <div className='loading'>Loading...</div>
    }
    
  return (
    <div className="movie-carousel-container">
      <Carousel>
        {
          randomMovies?.map((movie) =>{
            
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

                      <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                          <div className='play-button-icon-container' title='Watch Trailer'>
                            <FontAwesomeIcon className='play-button-icon'
                              icon={faCirclePlay}
                            />
                          </div>
                        </Link>

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