// src/hooks/useRecurrences.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { RecurrenceType } from '@/types/global';
import { getAllRecurrences } from '@/services/recurrenceService';

export const useRecurrences = () => {
  const [recurrences, setRecurrences] = useState<RecurrenceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecurrences = async () => {
      try {
        const data = await getAllRecurrences();
        setRecurrences(data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les récurrences');
        Alert.alert('Erreur', 'Impossible de charger les récurrences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecurrences();
  }, []);

  return { recurrences, isLoading, error };
};
