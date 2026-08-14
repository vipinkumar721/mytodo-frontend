import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Response Interceptor: Har response ko component tak pahunchne se pehle intercept karega
api.interceptors.response.use(
  (response) => {
    // Agar sab sahi hai (200 OK), toh response aage badha do
    return response;
  },
  (error) => {
    // Agar backend se error aayi hai
    if (error.response && error.response.status === 401) {
      
      // 🔴 FIX YAHAN HAI: 
      // Check karo ki error login request se toh nahi aayi hai.
      // Agar request URL mein '/login' nahi hai, tabhi logout aur redirect karo.
      if (error.config && !error.config.url.includes('/login')) {
        // 1. LocalStorage se user ka data hata do
        localStorage.removeItem('user');
        
        // 2. User ko wapas login page par bhej do
        window.location.href = '/login';
      }
    }
    
    // Error ko aage pass kar do taaki aapke components (jaise Login.jsx) usko catch kar sakein
    return Promise.reject(error);
  }
);

export default api;