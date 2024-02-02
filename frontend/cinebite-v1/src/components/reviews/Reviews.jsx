import './Reviews.css';
import { useEffect, useRef } from "react";
import api from '../../api/axiosConfig';
import {Link, useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import ReviewForm from "../reviewForm/ReviewForm";
import Button from "react-bootstrap/Button";
import NavLink from "react-bootstrap/NavLink";
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatDate = (dateString) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${monthNames[monthIndex]} ${day < 10 ? '0' + day : day}, ${year}`;
}

const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
}

const Reviews = ({getMovieData,movie,reviews,setReviews}) => {
    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;

    useEffect(()=>{
        getMovieData(movieId);
    },[])

    const addReview = async (e) => {
        e.preventDefault();

        const rev = revText.current;

        try {
            const response = await api.post("/api/v1/reviews", {
                reviewBody: rev.value,
                imdbId: movieId,
                votes: 0
            });
            const newReview = await response.data;
            const updatedReviews = [...reviews, newReview];
            rev.value = "";
            setReviews(updatedReviews);
        }

        catch(err) {
            console.error(err);
        }
    }

    const updateReviewVotes = (updatedReview) => {
        setReviews(reviews.map(review => review.id === updateReviewVotes.id ? updatedReview : review));
    }

    const increaseVotes = async (reviewId) => {
        // TODO: Increase votes in the database, then fetch the updated review list or update the state
        // DOES NOT WORK
        try {
            const response = await api.post(`/api/v1/reviews/upvote/${reviewId}`);
            const updatedReview = response.data;
            updateReviewVotes(updatedReview);
        }
        catch (error) {
            console.error('error upvoting: ', error);
        }
    }

    const decreaseVotes = async (reviewId) => {
        // TODO: Decrease votes in the database, then fetch the updated review list or update the state
        // DOES NOT WORK
        try {
            const response = await api.post(`/api/v1/reviews/downvote/${reviewId}`);
            const updatedReview = response.data;
            updateReviewVotes(updatedReview);
        }
        catch (error) {
            console.error('error downvoting: ', error);
        }
    }

    // Work on this, cycling background image
    // useEffect(() => {
    //     if (movie?.backdrops?.length > 0) {
    //       let currentIndex = 0;
    //       const interval = setInterval(() => {
    //         const bgImageDiv = document.querySelector('.background-image');
    //         // Set the image URL as the background image
    //         bgImageDiv.style.backgroundImage = `url('${movie.backdrops[currentIndex]}')`;
    //         bgImageDiv.style.backgroundSize = 'cover';
    //         bgImageDiv.style.backgroundPosition = 'center';
    //         bgImageDiv.style.opacity = '0.5'; // Set the opacity level here
    //         // Fade to black effect will be handled by the ::after pseudo-element in CSS
    //         currentIndex = (currentIndex + 1) % movie.backdrops.length;
    //       }, 3000); // Change image every 3 seconds
    
    //       // Set the initial background image before the interval starts
    //       document.querySelector('.background-image').style.backgroundImage = `url('${movie.backdrops[0]}')`;
    
    //       return () => clearInterval(interval); // Clear interval on component unmount
    //     }
    //   }, [movie?.backdrops]);

    return (
        <div>
        <div className="background-image" style={{"--img": `url(${movie?.backdrops[0]})`}}></div>
        <Container className='review-container'>
            <Row className='title-and-info'>
                <Col style={{marginTop: '30px', fontWeight: 200}}><h3>{movie?.title} / Reviews</h3></Col>
                <Row>
                    <Col style={{marginTop: '-3px', color: 'grey'}}>
                        <span>{movie?.releaseDate.substring(0, 4)} • </span>
                        <a href={`https://imdb.com/title/${movie?.imdbId}`} target="_blank" rel="noopener noreferrer" style={{ textDecorationColor: 'grey' }}>
                            <span style={{color: 'grey'}}>IMDB</span>
                        </a>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-2">
            <Col className='poster-column'>
                <div className='movie-poster-review'>
                    <img src={movie?.poster} alt="" style={{marginBottom: '20px', width: '100%'}}/>
                    <Link to={`/Trailer/${movie?.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                        <div className='play-button-icon-container-review' title="Watch Trailer">
                            <FontAwesomeIcon className='play-button-icon' icon={faCirclePlay}/>
                        </div>
                    </Link>
                </div>
            </Col>
                <Col>
                    {
                        <>
                            <p style={{marginBottom: '30px'}}>{movie?.overview}</p>
                            <div className='genres'>
                                {movie?.genres.map((g) => {
                                    return (
                                        <span className='genre-name'>{g}</span>
                                    )
                                })}
                            </div>
                            <hr style={{marginBottom: '30px'}}/>
                            <Row>
                                <Col>
                                    <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review!" className="review-submission"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <hr style={{marginTop: '30px'}}/>
                                </Col>
                            </Row>
                        </>
                    }
                    {
                        reviews?.map((r) => {
                            return (
                                <>
                                    <Row style={{ alignItems: 'center' }}>
                                        <Col xs="auto" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <FontAwesomeIcon icon={faChevronUp} className="upvote-button" onClick={() => increaseVotes(r.id)}/>
                                            <div style={{color:'grey'}}>{r.votes}</div>
                                            <FontAwesomeIcon icon={faChevronDown} className="downvote-button" onClick={() => decreaseVotes(r.id)}/>
                                        </Col>

                                        <Col>
                                            <div>{r.body}</div>
                                            <div style={{color: 'grey'}}>{formatDate(r?.id.date)} • {formatTime(r?.id.date)}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                    <Col>
                                        <hr />
                                    </Col>
                                </Row>
                                </>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default Reviews