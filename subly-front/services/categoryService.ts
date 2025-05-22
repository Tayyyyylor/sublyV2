import axiosInstance from '@/helpers/axiosInstance';

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    const rawData = response.data;
    return rawData;
  } catch (error) {
    console.error('Erreur de récupération des événements :', error);
    throw error;
  }
};
