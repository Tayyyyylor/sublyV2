import { useAuth } from '@/context/useAuth';
import { SafeAreaView, Text, View } from 'react-native';
import { format } from 'date-fns';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useState } from 'react';
import ButtonAdd from '../ButtonAdd';
import EventOverlay from './EventOverlay';

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

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    monthNamesShort: [
      'Janv.',
      'Févr.',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juil.',
      'Août',
      'Sept.',
      'Oct.',
      'Nov.',
      'Déc.',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = 'fr';

  return (
    <SafeAreaView className="relative">
      <Text className="font-bold pl-3 mb-[10px]">{date}</Text>
      <Text className="text-blue-700 text-[30px] text-center font-bold">
        Hello {user?.username} ! Bienvenue !
      </Text>
      <Text className="text-pink-500 text-[20px] text-center mt-2 font-bold">
        Dépense prévue ce jour : 20€
      </Text>
      <Text className="text-grey-600 text-center mt-2">
        Solde fin du mois : 12€
      </Text>
      <View className="p-[10px]">
        <Calendar
          theme={{
            textDayFontFamily: 'Inter-Medium',
            textMonthFontFamily: 'Inter-Bold',
            todayTextColor: 'red',
            selectedDayBackgroundColor: 'red',
          }}
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
            console.log('Jour sélectionné :', day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
        />
      </View>
      <Text>Liste des dépenses de la journée</Text>
      <ButtonAdd openModal={openModal} />
      <EventOverlay isVisible={isOverlayVisible} onClose={closeModal} />
    </SafeAreaView>
  );
};

export default Dashboard;
