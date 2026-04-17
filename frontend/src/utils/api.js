import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for cookies/CSRF
});

// Request interceptor to handle CSRF or other headers if needed
api.interceptors.request.use((config) => {
  // You can add headers here if necessary
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized (redirect to login)
    // window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
