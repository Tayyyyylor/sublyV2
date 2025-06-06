import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_PUBLIC_NEST_BASE_URL ||
    'https://sublyv2-production.up.railway.app',
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = await SecureStore.getItemAsync('session');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
