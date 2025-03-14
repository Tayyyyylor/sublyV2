import axiosInstance from '../helpers/axiosInstance';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs :', error.response?.data || error.message);
    throw error;
  }
};


export const fetchUser = async (userData: User) => {
    try {
      const response = await axiosInstance.post('/user', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l’inscription :', error.response?.data || error.message);
      throw error;
    }
  };

  export const registerUser = async (userData: User) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l’inscription :', error.response?.data || error.message);
      throw error;
    }
  };

  export const loginUser = async (userData: User) => {
    try {
      const response = await axiosInstance.post("/users/login", userData);
      const token = response.data.token;
  
      // Stocker le token localement
      await AsyncStorage.setItem("authToken", token);
      return token;
    } catch (error: any) {
      console.error("Erreur de connexion :", error.response?.data || error.message );
      throw error;
    }
  };
  
  // 🔹 Vérifier si un utilisateur est connecté
  export const getAuthToken = async () => {
    return await AsyncStorage.getItem("authToken");
  };
  
  // 🔹 Déconnexion de l'utilisateur
  export const logoutUser = async () => {
    await AsyncStorage.removeItem("authToken");
  };