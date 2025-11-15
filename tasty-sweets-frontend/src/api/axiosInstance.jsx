import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://demo-deployment-latest-5d7q.onrender.com/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🚀 Request Interceptor:');
        console.log('  URL:', config.baseURL + config.url);
        console.log('  Method:', config.method.toUpperCase());
        
        // Ensure headers object exists
        if (!config.headers) {
            config.headers = {};
        }
        
        // Add token if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('  ✅ Token added');
        } else {
            console.log('  ⚠️  No token found');
        }
        
        // Handle Content-Type based on data type
        if (config.data instanceof FormData) {
            console.log('  📦 FormData detected - removing Content-Type header');
            // For FormData, remove Content-Type to let browser set it with boundary
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
            
            // Log FormData contents for debugging
            console.log('  📋 FormData contents:');
            for (let [key, value] of config.data.entries()) {
                if (value instanceof File) {
                    console.log(`    ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`    ${key}:`, value);
                }
            }
        } else {
            console.log('  📄 JSON data detected');
            // For regular JSON requests
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        
        console.log('  📨 Final headers:', Object.keys(config.headers));
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.config.url, '- Status:', response.status);
        return response;
    },
    (error) => {
        console.error('❌ Response error:');
        console.error('  Status:', error.response?.status);
        console.error('  URL:', error.config?.url);
        console.error('  Data:', error.response?.data);
        
        if (error.response?.status === 401) {
            console.error('🔒 401 Unauthorized - redirecting to login');
            localStorage.removeItem('token');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;