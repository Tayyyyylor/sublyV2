import axiosInstance from '@/helpers/axiosInstance';

export const getAllRecurrences = async () => {
  try {
    const response = await axiosInstance.get('/recurrences');
    const rawData = response.data;
    return rawData;
  } catch (error) {
    console.error('Erreur de récupération des événements :', error);
    throw error;
  }
};
