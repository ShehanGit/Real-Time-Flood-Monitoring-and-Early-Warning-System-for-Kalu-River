import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Water level API functions
export const getLatestWaterLevels = async () => {
  try {
    const response = await api.get('/water-levels/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest water levels:', error);
    throw error;
  }
};

export const getWaterLevelHistory = async (location, hours = 24) => {
  try {
    const response = await api.get(`/water-levels/history/${location}?hours=${hours}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching water level history:', error);
    throw error;
  }
};

export const getChartData = async (location, hours = 24) => {
  try {
    const response = await api.get(`/water-levels/chart-data/${location}?hours=${hours}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const fetchLatestData = async () => {
  try {
    const response = await api.post('/water-levels/fetch');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest data:', error);
    throw error;
  }
};

// User API functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default api;