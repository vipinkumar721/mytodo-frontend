import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    
    if (error.response && error.response.status === 401) {
      
      
      if (error.config && !error.config.url.includes('/login')) {
        // 1. LocalStorage
        localStorage.removeItem('user');

        window.location.href = '/login';
      }
    }
    
    
    return Promise.reject(error);
  }
);

export default api;