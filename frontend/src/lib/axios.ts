import axios from 'axios';
import { useAuthStore } from '../store/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error?.response?.data?.message || error.message || 'Unexpected error';
    const normalized = Array.isArray(msg) ? msg.join(', ') : msg;

    alert(normalized);

    return Promise.reject(error);
  },
);

export default instance;
