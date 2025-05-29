import { EventType } from '@/types/global';
import axiosInstance from '../helpers/axiosInstance';
import { EventCreateType } from '@/types/event';

const formatDateToUtcMidnight = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

export const createEvent = async (eventData: EventCreateType) => {
  try {
    const eventPayload = {
      ...eventData,
      startDate: formatDateToUtcMidnight(eventData.startDate),
      endDate: eventData.endDate
        ? formatDateToUtcMidnight(eventData.endDate)
        : undefined,
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

export const updateEvent = async (
  id: string,
  event: Partial<EventCreateType>,
): Promise<EventType> => {
  try {
    const response = await axiosInstance.patch(`/events/${id}`, event);
    return response.data;
  } catch (error: any) {
    console.error(
      'Erreur de modification :',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'évènement :", error);
    throw error;
  }
};
