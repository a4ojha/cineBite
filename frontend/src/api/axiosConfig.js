import axios from 'axios';

export default axios.create({
    baseURL: 'https://cinebite-api.onrender.com',
    headers: {"skip-browser-warning": "true"}
})