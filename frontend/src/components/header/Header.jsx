import './Header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {NavLink} from "react-router-dom";
import { faFilm, faSearch, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiBatteryChargingOutline, mdiBatteryChargingWireless, mdiNewBox } from '@mdi/js';

import { signOut } from 'firebase/auth';
import { auth } from '../googleSignIn/firebaseConfig'; 

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!searchTerm.trim()) return; // Prevents empty queries

        navigate(`/search/${searchTerm}`);
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.clear();
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{marginTop: '-10px'}} id="navbar">
        <Container fluid>    { /* debugging */ }
            <Navbar.Brand href="/" style={{color: "lightblue", fontWeight: 700 }}>
                <FontAwesomeIcon icon={faFilm} style={{marginRight: '8px'}} />cineBite
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto my-2 my-lg-0" style={{maxHeight: '150px', display: 'flex', alignItems: 'center'}} id="links">
                    <NavLink className="nav-link" to="/">Home</NavLink>
                    <NavLink className="nav-link" to="/movies">All Movies</NavLink>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <NavLink className="nav-link" to="/request">Contribute</NavLink>
                        <span id="new-icon" style={{ display: 'inline-block' }}>
                            <Icon path={mdiNewBox} size={1} style={{ color: '#B7D4FF', marginLeft: '5px' }} />
                        </span>
                    </div>
                </Nav>
                <form onSubmit={handleSubmit} className="d-flex mx-lg-auto" id='searchForm'>
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        id='searchbar'
                        title='Search for a movie'
                    />
                    <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit" id="search-button">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>
                <FontAwesomeIcon icon={faRightFromBracket} color='red' onClick={handleSignOut} className='logout' title='Logout'/>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}

export default Header