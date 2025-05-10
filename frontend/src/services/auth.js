import { loginUser, getCurrentUser } from './api';

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Handle login and store token
export const login = async (credentials) => {
  try {
    const { token } = await loginUser(credentials);
    setToken(token);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Handle logout
export const logout = () => {
  removeToken();
};

// Get authenticated user info
export const getAuthUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    return await getCurrentUser();
  } catch (error) {
    // If there's an error (like an expired token), logout
    logout();
    return null;
  }
};