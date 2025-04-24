import { useAuth } from '@/context/useAuth';
import axiosInstance from '../helpers/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
  username?: string;
  email?: string;
  password: string;
}

export const registerUser = async (userData: User) => {
  try {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  } catch (error: any) {
    console.error(
      'Erreur lors de l’inscription :',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const loginUser = async (
  userData: User,
  signIn: (token: string) => void,
) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    const token = response.data.access_token;
    if (!token) throw new Error('Token manquant dans la réponse API');
    signIn(token);
    router.replace('/(tabs)');
  } catch (error: any) {
    console.error(
      'Erreur de connexion :',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const logoutUser = async (signOut: () => void) => {
  try {
    signOut();
    router.replace('/signin');
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};
