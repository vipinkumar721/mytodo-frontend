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
      // 1. LocalStorage se user ka data hata do
      localStorage.removeItem('user');
      
      // 2. User ko wapas login page par bhej do
      // Hum React Router ke bahar hain isliye window.location ka use kar rahe hain
      window.location.href = '/login';
    }
    
    // Error ko aage pass kar do taaki aapke components usko catch kar sakein
    return Promise.reject(error);
  }
);

export default api;