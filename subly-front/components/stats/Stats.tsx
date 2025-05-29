import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView, Text, View, Pressable, Alert } from 'react-native';
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isBefore,
  addDays,
  addWeeks,
  addYears,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAllEvent } from '@/services/eventService';
import { getAllRecurrences } from '@/services/recurrenceService';
import { EventType, RecurrenceType } from '@/types/global';

const Stats = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [allRecurrences, setAllRecurrences] = useState<RecurrenceType[]>([]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Filtrer les événements pour le mois courant
  const currentMonthEvents = useMemo(() => {
    // Normaliser le mois actuel (mettre à minuit au début du mois)
    const normalizedCurrentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );

    return allEvents.filter((event) => {
      // Trouver la récurrence associée à l'événement
      const recurrence = allRecurrences.find(
        (r) => r.id === event.recurrence.id,
      );
      if (!recurrence) return false;

      // Normaliser les dates de l'événement
      const startDate = new Date(
        new Date(event.startDate).setHours(0, 0, 0, 0),
      );
      const endDate = event.endDate
        ? new Date(new Date(event.endDate).setHours(0, 0, 0, 0))
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

      // Si la date de début est après le mois actuel ou la date de fin est avant le mois actuel
      if (
        startDate > endDate ||
        startDate >
          new Date(
            normalizedCurrentMonth.getFullYear(),
            normalizedCurrentMonth.getMonth() + 1,
            0,
          ) ||
        endDate < normalizedCurrentMonth
      ) {
        return false;
      }

      // Pour les événements ponctuels
      if (recurrence.frequency === 'ONCE') {
        return isSameMonth(startDate, normalizedCurrentMonth);
      }

      // Pour les événements récurrents
      let currentDate = new Date(startDate);
      let found = false;

      while (isBefore(currentDate, endDate) && !found) {
        if (isSameMonth(currentDate, normalizedCurrentMonth)) {
          found = true;
        }

        // Avancer la date selon la fréquence
        switch (recurrence.frequency) {
          case 'DAILY':
            currentDate = addDays(currentDate, 1);
            break;
          case 'WEEKLY':
            currentDate = addWeeks(currentDate, 1);
            break;
          case 'MONTHLY':
            currentDate = addMonths(currentDate, 1);
            break;
          case 'QUARTERLY':
            currentDate = addMonths(currentDate, 3);
            break;
          case 'YEARLY':
            currentDate = addYears(currentDate, 1);
            break;
          default:
            return false;
        }
      }

      return found;
    });
  }, [allEvents, allRecurrences, currentMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, recurrences] = await Promise.all([
          getAllEvent(),
          getAllRecurrences(),
        ]);
        setAllEvents(events);
        setAllRecurrences(recurrences);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch data.');
      }
    };
    fetchData();
  }, []);

  // Ajouter un useEffect pour logger le changement de mois
  useEffect(() => {
    console.log('Changement de mois:', format(currentMonth, 'yyyy-MM-dd'));
  }, [currentMonth]);

  console.log("Nombre d'événements trouvés:", currentMonthEvents.length);

  return (
    <SafeAreaView className="bg-[#121212] h-full px-4">
      <Text className="text-white text-[32px] font-bold text-center mb-4">
        Statistiques
      </Text>

      <View className="flex-row justify-between items-center bg-gray-800 rounded-lg p-4 mb-6">
        <Pressable onPress={handlePreviousMonth}>
          <Text className="text-white text-xl">←</Text>
        </Pressable>
        <Text className="text-white text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </Text>
        <Pressable onPress={handleNextMonth}>
          <Text className="text-white text-xl">→</Text>
        </Pressable>
      </View>

      {/* Liste des événements */}
      <View className="flex-1">
        {currentMonthEvents.map((event) => (
          <View key={event.id} className="bg-gray-800 p-4 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-lg">{event.name}</Text>
              <Text
                className={`text-lg font-bold ${event.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}
              >
                {event.type === 'EXPENSE' ? '-' : '+'}
                {event.amount}€
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Stats;
