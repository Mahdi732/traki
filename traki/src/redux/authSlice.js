import { createSlice } from '@reduxjs/toolkit';

// Simple auth slice - stores only user info
// Token is in httpOnly cookie (cannot be accessed by JS)
const initialState = {
  user: localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null,
  isAuthenticated: !!localStorage.getItem('user'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user after login
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    // Clear user on logout
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove user from localStorage
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
