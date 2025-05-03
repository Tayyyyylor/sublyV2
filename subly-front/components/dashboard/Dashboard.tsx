import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

import { EventType } from '@/types/global';
import { useAuth } from '@/context/useAuth';
import { getAllEvent } from '@/services/eventService';
import { today } from '@/helpers/global.utils';
import {
  doesEventOccurOnDate,
  generateMarkedDates,
  getDailyTotal,
  getMonthlyTotal,
} from './Dashboard.utils';

import EventOverlay from '../events/EventOverlay';
import EventCard from '../events/EventCard';
import ButtonAdd from '../events/ButtonAdd';
import CalendarComponent from './Calendar';
import SaleOfTheDay from './SaleOfTheDay';

const Dashboard = () => {
  const { user } = useAuth();
  const date = format(today, 'dd/MM/yyyy');
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [_, setIsLoading] = useState(true);

  const dailyTotal = getDailyTotal(events);
  const monthlyTotal = getMonthlyTotal(allEvents, currentMonth);

  const openModal = () => {
    setIsOverlayVisible(true);
  };

  const closeModal = () => {
    setIsOverlayVisible(false);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getAllEvent();
        setAllEvents(resp);
        const filtered = resp.filter((event: EventType) =>
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
  }, [selectedDate, isOverlayVisible, events]);

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
        <Text className="text-black-700 text-[30px] text-center font-bold">
          Total au mois <Text className="text-blue-700">{monthlyTotal}€</Text>
        </Text>
      </View>
      <View>
        <SaleOfTheDay totalCount={dailyTotal} currency="€" />
      </View>
      <View className="p-[10px]">
        <CalendarComponent
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={generateMarkedDates(allEvents, selectedDate)}
          onMonthChange={handleMonthChange}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} //
        showsVerticalScrollIndicator={false}
        className="mt-4 px-4"
      >
        {events.length === 0 ? (
          <Text className="text-gray-500 text-center">
            Aucun événement prévu
          </Text>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              amount={event.amount}
              onPress={() => router.push(`/event/${event.id}`)}
            />
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
