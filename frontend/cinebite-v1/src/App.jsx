import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';

import { auth, provider } from './components/googleSignIn/firebaseConfig'; // firebase Google Authentication
import { onAuthStateChanged } from 'firebase/auth';

import SignIn from './components/googleSignIn/SignIn';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import AllMovies from './components/allMovies/AllMovies';
import RequestMovie from './components/requestMovie/RequestMovie';
import RequestMovie from './components/requestMovie/RequestMovie';
import Search from './components/search/Search';


function App() {
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState();
  const [user, setUser] = useState(null); // State to keep track of user's sign-in status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser will be null if not signed in
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const getMovies = async () => {

    try {
      const response = await api.get("/api/v1/movies");
      setMovies(response.data);
    } 
    catch(err) {
      console.log(err);
    }
  }

  const getMovieData = async (movieId) => {

    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      const singleMovie = response.data;
      setMovie(singleMovie);
      setReviews(singleMovie.reviewIds);
    }
    
    catch (error) {
      console.log(error);
    }

  }

  // useEffect for debugging state updates
  useEffect(() => {

  }, [movie, reviews]);

  useEffect(() => {
    getMovies();
  },[])


  // Conditionally render content based on user sign-in status
  if (!user) {
    return <SignIn />; // Replace with your sign-in component
  }


  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<Home movies={movies} />} ></Route>
          <Route path="/trailer/:ytTrailerId" element={<Trailer/>}></Route>
          <Route path="/reviews/:movieId" element ={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} />}></Route>
          <Route path="/movies" element ={<AllMovies movies={movies}/>}></Route>
          <Route path="/request" element ={<RequestMovie />}></Route>
          <Route path="/search/:searchQuery" element={<Search movies={movies} />}></Route>
        </Route>
      </Routes>

    </div>
  );
}

export default App