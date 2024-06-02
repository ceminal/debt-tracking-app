import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('isAuthenticated'),
  name: localStorage.getItem('name'),
  email: localStorage.getItem('email'),
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
      state.token = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
