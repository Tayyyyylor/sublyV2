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

const Dashboard = () => {
  const { user } = useAuth();

  const date = format(new Date(), 'dd/MM/yyyy');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const openModal = () => {
    setIsOverlayVisible(true);
  };

  const closeModal = () => {
    setIsOverlayVisible(false);
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getAllEvent();
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

  console.log('events', events);

  return (
    <SafeAreaView className="relative h-full">
      <Text className="font-bold pl-4 mb-[10px] text-[20px] text-blue-700">
        {date}
      </Text>
      <Text className="text-black-700 text-[30px] text-center font-bold">
        Hello <Text className="text-blue-700">{user?.username}</Text> !
        Bienvenue !
      </Text>
      <Text className="text-black-700 text-[20px] text-center mt-2 font-bold">
        Dépense prévue ce jour : <Text className="text-blue-700">20€</Text>
      </Text>
      <Text className="text-grey-600 text-center mt-2">
        Solde fin du mois : 12€
      </Text>
      <View className="p-[10px]">
        <CalendarComponent
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
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
      <EventOverlay isVisible={isOverlayVisible} onClose={closeModal} />
    </SafeAreaView>
  );
};

export default Dashboard;
