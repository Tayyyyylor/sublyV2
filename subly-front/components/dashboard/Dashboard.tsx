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

    events.forEach((event) => {
      const dateKey = event.startDate.toISOString().split('T')[0];

      marked[dateKey] = {
        ...marked[dateKey], // au cas où on veut empiler d'autres infos plus tard
        marked: true,
        dotColor: 'red', // ou une couleur dynamique selon l’event
      };
    });

    // ensuite on marque la date sélectionnée
    marked[selectedDate] = {
      ...marked[selectedDate], // ✅ on garde dotColor etc.
      selected: true,
      selectedColor: 'blue',
    };

    return marked;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getAllEvent();
        setAllEvents(resp);
        const filtered = resp.filter((event: EventType) =>
          event.startDate.toISOString().startsWith(selectedDate),
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
