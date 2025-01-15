import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_MEDUSA_BACKEND_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
