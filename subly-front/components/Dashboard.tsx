import { useAuth } from '@/context/useAuth';
import { SafeAreaView, Text, View } from 'react-native';
import { format } from 'date-fns';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const Dashboard = () => {
  const { user } = useAuth();

  const date = format(new Date(), 'dd/MM/yyyy');

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
    <SafeAreaView className="">
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
        />
      </View>
      <Text className="">Liste des dépenses de la journée</Text>
    </SafeAreaView>
  );
};

export default Dashboard;
