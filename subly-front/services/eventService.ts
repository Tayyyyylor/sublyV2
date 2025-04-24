import { Frequency } from '@/types/global';
import axiosInstance from '../helpers/axiosInstance';
import { router } from 'expo-router';

interface Event {
  name: string;
  amount: string;
  frequency: Frequency;
  startDate: Date;
}

export const createEvent = async (eventData: Event) => {
  try {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  } catch (error: any) {
    console.error(
      'Erreur lors de la création :',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllEvent = async () => {
  try {
    const response = await axiosInstance.get('/events');
    return response.data;
  } catch (error) {}
};
export const modifyEvent = async (
  eventData: Event,
  signIn: (token: string) => void,
) => {
  try {
    const response = await axiosInstance.post('/auth/login', eventData);
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

export const deleteEvent = async (signOut: () => void) => {
  try {
    signOut();
    router.replace('/signin');
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};
