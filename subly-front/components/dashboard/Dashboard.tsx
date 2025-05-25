import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

import { EventType, FrequencyType } from '@/types/global';
import { useAuth } from '@/context/useAuth';
import { getAllEvent } from '@/services/eventService';
import { today } from '@/helpers/global.utils';
import {
  getDailyTotal,
  doesEventOccurOnDate,
  generateMarkedDates,
  getMonthlyTotal,
} from './Dashboard.utils';

import EventOverlay from '../events/EventOverlay';
import EventCard from '../events/EventCard';
import ButtonAdd from '../events/ButtonAdd';
import CalendarComponent from './Calendar';
import SaleOfTheDay from './SaleOfTheDay';
import { getAllRecurrences } from '@/services/recurrenceService';

const Dashboard = () => {
  const { user } = useAuth();
  const date = format(today, 'dd/MM/yyyy');
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [allRecurrences, setAllRecurrences] = useState<FrequencyType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [_, setIsLoading] = useState(true);

  const dailyTotal = getDailyTotal(events);
  const monthlyTotal = getMonthlyTotal(allEvents, currentMonth, allRecurrences);

  const openModal = () => {
    setIsOverlayVisible(true);
  };

  const closeModal = () => {
    setIsOverlayVisible(false);
  };

  const handleMonthChange: (date: Date) => void = (date: Date) => {
    setCurrentMonth(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, recs] = await Promise.all([
          getAllEvent(),
          getAllRecurrences(),
        ]);
        setAllEvents(events);
        setAllRecurrences(recs);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOverlayVisible]);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const filtered = allEvents.filter((event) => {
          const rec = allRecurrences.find((r) => r.id === event.recurrenceId);
          return rec
            ? doesEventOccurOnDate(event, selectedDate, rec.frequency)
            : false;
        });
        setEvents(filtered);
      } catch {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedDate, isOverlayVisible, allEvents, allRecurrences]);

  return (
    <SafeAreaView className="relative h-full bg-[#121212]">
      <Text className="font-bold pl-4 mb-[10px] text-[20px] text-yellow-400">
        {date}
      </Text>
      <Text className="text-[30px] text-center font-bold text-white">
        Hello <Text className="text-yellow-400">{user?.username}</Text> !
        Bienvenue !
      </Text>
      <View>
        <Text className="text-[30px] text-center font-bold text-white">
          Total au mois{' '}
          <Text
            className={`${monthlyTotal >= 0 ? 'text-emerald-500' : 'text-red-400'}`}
          >
            {monthlyTotal}€
          </Text>
        </Text>
      </View>
      <View className="mb-9">
        <SaleOfTheDay totalCount={dailyTotal} currency="€" />
      </View>
      <View className="p-[10px] bg-[#121212]">
        <CalendarComponent
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={generateMarkedDates(
            allEvents,
            allRecurrences,
            selectedDate,
          )}
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
          <View className="flex-col gap-5">
            <Text className="text-white text-[16px] font-bold text-center">
              Transaction(s) du jour
            </Text>
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                data={event}
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))}
          </View>
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
