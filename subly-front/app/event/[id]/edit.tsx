import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import EventEdit from '@/components/events/EventEdit';
import { getOneEvent } from '@/services/eventService';
import { EventType } from '@/types/global';

export default function EditEventPage() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getOneEvent(id as string);
        setEvent(data);
      } catch (error) {
        Alert.alert('Erreur', "Impossible de charger l'événement.");
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return null; // Or a loading component
  }

  return <EventEdit event={event} />;
}
