import axios from 'axios';
import Cookies from 'js-cookie';
import { HOST } from '@/utils/constants';

export const apiClient = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});