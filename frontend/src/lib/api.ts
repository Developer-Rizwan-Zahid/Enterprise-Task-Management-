import axios from 'axios';

const TASK_SERVICE_URL = process.env.NEXT_PUBLIC_TASK_SERVICE_URL || 'http://localhost:5048/api';
const ANALYTICS_SERVICE_URL = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || 'http://localhost:8000';

export const taskApi = axios.create({
    baseURL: TASK_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyticsApi = axios.create({
    baseURL: ANALYTICS_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token to headers
const addAuthToken = (config: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

taskApi.interceptors.request.use(addAuthToken);
analyticsApi.interceptors.request.use(addAuthToken);

// Add response interceptor to handle token expiration
taskApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const accessToken = localStorage.getItem('token');

            if (refreshToken && accessToken) {
                try {
                    const res = await axios.post(`${TASK_SERVICE_URL}/Auth/refresh-token`, {
                        accessToken,
                        refreshToken,
                    });

                    if (res.status === 200) {
                        localStorage.setItem('token', res.data.accessToken);
                        localStorage.setItem('refreshToken', res.data.refreshToken);
                        taskApi.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                        return taskApi(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
