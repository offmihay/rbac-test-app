import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { notification } from 'antd';

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
    const status = error?.response?.status;
    const method = error?.config?.method?.toLowerCase();
    const isMutationMethod = ['post', 'put', 'patch', 'delete'].includes(method);

    if (status === 401 && !error?.response?.data.message) {
      useAuthStore.getState().logout();
      notification.info({ placement: 'topRight', message: 'Your session is expired. Please try sign in again' });
    }

    const msg = error?.response?.data?.message || error.message || 'Unexpected error';
    const normalized = Array.isArray(msg) ? msg.join(', ') : msg;

    if (isMutationMethod) {
      notification.error({ placement: 'topRight', message: normalized });
    }

    return Promise.reject(new Error(normalized));
  },
);

export default instance;
