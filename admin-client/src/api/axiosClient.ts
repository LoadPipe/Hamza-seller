import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://your-api-url.com', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
