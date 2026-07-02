import axios from 'axios';
import { saveToken, saveUser, getToken } from '../utils/tokenStorage';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  await saveToken(token);
  await saveUser(user);
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};