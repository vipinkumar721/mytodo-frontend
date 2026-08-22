import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosConfig";

const initialState = {
  todos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// 1. Get Todos
export const getTodos = createAsyncThunk(
  "todos/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/todos");
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 2. Create Todo
export const createTodo = createAsyncThunk(
  "todos/create",
  async (todoData, thunkAPI) => {
    try {
      const response = await api.post("/todos", todoData);
      return response.data.data; // Naya todo return hoga
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 3. Delete Todo
export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/todos/${id}`);
      return id; 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// 4. Update Todo
export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({ id, todoData }, thunkAPI) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET TODOS
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // CREATE TODO
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos.push(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // DELETE TODO
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
  
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // UPDATE TODO
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id,
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = todoSlice.actions;
export default todoSlice.reducer;
