import axiosInstance from '../helpers/axiosInstance';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const registerUser = async (userData: User) => {
  try {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de l’inscription :', error.response?.data || error.message);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs :', error.response?.data || error.message);
    throw error;
  }
};
