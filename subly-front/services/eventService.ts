import { FrequencyType } from '@/types/global';
import axiosInstance from '../helpers/axiosInstance';
import { router } from 'expo-router';

interface EventType {
  name: string;
  amount: number;
  frequency: FrequencyType;
  startDate: Date;
}

const formatDateToUtcMidnight = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

export const createEvent = async (eventData: EventType) => {
  try {
    const eventPayload = {
      ...eventData,
      startDate: formatDateToUtcMidnight(eventData.startDate),
    };

    const response = await axiosInstance.post('/events', eventPayload);
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
    const rawData = response.data;
    return rawData.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : undefined,
    }));
  } catch (error) {
    console.error('Erreur de récupération des événements :', error);
    throw error;
  }
};

export const getOneEvent = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/events/${id}`);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : undefined,
    };
  } catch (error) {
    console.error('Erreur de récupération des événements :', error);
    throw error;
  }
};

export const modifyEvent = async (
  eventData: EventType,
  signIn: (token: string) => void,
) => {
  try {
    const response = await axiosInstance.post('/events/login', eventData);
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
