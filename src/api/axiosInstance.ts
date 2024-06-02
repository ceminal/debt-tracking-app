import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://study.logiper.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    const { status, data } = response.data;
    if (status === 'success') {
      return data;
    } else {
      return Promise.reject(new Error(data));
    }
  },
  error => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data.message || 'error'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;