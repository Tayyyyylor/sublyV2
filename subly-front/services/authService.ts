import axiosInstance from '../helpers/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
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

export const loginUser = async (userData: User) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    const token = response.data.access_token;

    // Stocker le token localement
    await AsyncStorage.setItem('authToken', token);
    return token;
  } catch (error: any) {
    console.error(
      'Erreur de connexion :',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 🔹 Vérifier si un utilisateur est connecté
export const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return token && token !== 'null' && token !== 'undefined' ? token : null;
};

// 🔹 Déconnexion de l'utilisateur
export const logoutUser = async () => {
  await AsyncStorage.removeItem('authToken');
};
