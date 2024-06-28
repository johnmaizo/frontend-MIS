import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000'; // Set your backend API base URL
axios.defaults.withCredentials = true; // Include cookies in requests

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
