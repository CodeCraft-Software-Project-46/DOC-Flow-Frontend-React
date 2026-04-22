import axios, { type InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to the header before every request.
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

/*
 * RESPONSE INTERCEPTOR
 * If the response is 401 (token expired/invalid), kick them to login.
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;