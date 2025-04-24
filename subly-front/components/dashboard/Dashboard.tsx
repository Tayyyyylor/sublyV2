import { useAuth } from '@/context/useAuth';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import ButtonAdd from '../ButtonAdd';
import EventOverlay from './EventOverlay';
import { getAllEvent } from '@/services/eventService';
import { EventType } from '@/types/global';
import CalendarComponent from './Calendar';
import EventCard from './EventCard';
import { today } from '@/helpers/global.utils';
import SaleOfTheDay from './SaleOfTheDay';

const Dashboard = () => {
  const { user } = useAuth();
  const date = format(today, 'dd/MM/yyyy');

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dailyTotal = events.reduce((sum, event) => {
    return sum + Number(event.amount);
  }, 0);

  const openModal = () => {
    setIsOverlayVisible(true);
  };

  const closeModal = () => {
    setIsOverlayVisible(false);
  };

  const generateMarkedDates = (events: EventType[], selectedDate: string) => {
    const marked: Record<
      string,
      {
        marked?: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
      }
    > = {};

    const horizon = new Date();
    horizon.setFullYear(horizon.getFullYear() + 1); // 1 an d’avance

    events.forEach((event) => {
      const recurringDates = generateRecurringDates(event, horizon);

      recurringDates.forEach((dateKey) => {
        marked[dateKey] = {
          ...marked[dateKey],
          marked: true,
          dotColor: 'red',
        };
      });
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: 'blue',
    };

    return marked;
  };

  const generateRecurringDates = (
    event: EventType,
    selectedLimit?: Date,
  ): string[] => {
    const occurrences: string[] = [];
    const start = new Date(event.startDate);
    const limit = event.endDate
      ? new Date(event.endDate)
      : (selectedLimit ?? new Date());

    if (!event.frequency || event.frequency === 'one') {
      occurrences.push(start.toISOString().split('T')[0]);
      return occurrences;
    }

    let current = new Date(start);
    while (current <= limit) {
      occurrences.push(current.toISOString().split('T')[0]);

      switch (event.frequency) {
        case 'monthly':
          current.setMonth(current.getMonth() + 1);
          break;
        case 'hebdo':
          current.setDate(current.getDate() + 7);
          break;
        case 'trimestriel':
          current.setMonth(current.getMonth() + 3);
          break;
        case 'yearly':
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
    }

    return occurrences;
  };

  const doesEventOccurOnDate = (event: EventType, date: string): boolean => {
    const start = new Date(event.startDate);
    const selected = new Date(date);

    // Si l'événement est avant la date sélectionnée
    if (start > selected) return false;

    switch (event.frequency) {
      case 'one':
        return start.toISOString().split('T')[0] === date;

      case 'monthly':
        return start.getDate() === selected.getDate();

      case 'hebdo':
        // différence en jours
        const daysDiff = Math.floor(
          (+selected - +start) / (1000 * 60 * 60 * 24),
        );
        return daysDiff % 7 === 0;

      case 'trimestriel':
        return (
          start.getDate() === selected.getDate() &&
          (selected.getMonth() - start.getMonth()) % 3 === 0
        );

      case 'yearly':
        return (
          start.getDate() === selected.getDate() &&
          start.getMonth() === selected.getMonth()
        );

      default:
        return false;
    }
  };

  const filtered = allEvents.filter((event: EventType) =>
    doesEventOccurOnDate(event, selectedDate),
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getAllEvent();
        setAllEvents(resp);
        const filtered = allEvents.filter((event: EventType) =>
          doesEventOccurOnDate(event, selectedDate),
        );
        setEvents(filtered);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedDate, isOverlayVisible]);

  return (
    <SafeAreaView className="relative h-full">
      <Text className="font-bold pl-4 mb-[10px] text-[20px] text-blue-700">
        {date}
      </Text>
      <Text className="text-black-700 text-[30px] text-center font-bold">
        Hello <Text className="text-blue-700">{user?.username}</Text> !
        Bienvenue !
      </Text>
      <View>
        <SaleOfTheDay totalCount={dailyTotal} currency="€" />
      </View>
      <View className="p-[10px]">
        <CalendarComponent
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={generateMarkedDates(allEvents, selectedDate)}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} // 👈 évite que le bouton flotte dessus
        showsVerticalScrollIndicator={false}
        className="mt-4 px-4"
      >
        {events.length === 0 ? (
          <Text className="text-gray-500 text-center">
            Aucun événement prévu
          </Text>
        ) : (
          events.map((event, idx) => (
            <EventCard key={idx} name={event.name} amount={event.amount} />
          ))
        )}
      </ScrollView>
      <ButtonAdd openModal={openModal} className="absolute bottom-2 right-2" />
      <EventOverlay
        isVisible={isOverlayVisible}
        onClose={closeModal}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

export default Dashboard;
