import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://demo-deployment-latest-5d7q.onrender.com/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.headers) {
            config.headers = {};
        }
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        } else {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;