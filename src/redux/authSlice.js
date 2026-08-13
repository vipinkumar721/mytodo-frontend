import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

// Page refresh hone par check karenge ki localStorage mein user details hain ya nahi
const token = localStorage.getItem('token');

const initialState = {
  token: token ? token : null, // user ki jagah token
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// 1. Register API Call
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/users/register', userData);
    
    // 👇 YAHAN CHANGE KIYA: Register ke baad bhi sirf token save karein
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.token; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Login API Call
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/users/login', userData);
    
    // 👇 Yahan changes kiye gaye hain: Poore 'user' ki jagah sirf 'token' save karein
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    // Sirf token ko hi return karein, poora data nahi
    return response.data.token;
    
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Logout API Call
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/users/logout');
    localStorage.removeItem('token'); // 👈 YAHAN CHANGE KIYA: 'user' ki jagah 'token' delete karein
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // 👇 Action.payload mein ab sirf token aayega (authService se)
        state.token = action.payload; 
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.token = null; // user ki jagah token null hoga
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null; // logout par token null kar do
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;