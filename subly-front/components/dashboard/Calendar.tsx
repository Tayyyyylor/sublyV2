import { Calendar, LocaleConfig } from 'react-native-calendars';

interface CalendarProps {
  onDayPress: (day: string) => void;
  markedDates: any;
  onMonthChange?: (date: Date) => void;
}

const CalendarComponent = ({
  onDayPress,
  markedDates,
  onMonthChange,
}: CalendarProps) => {
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
    <Calendar
      theme={{
        textDayFontFamily: 'Inter-Medium',
        textMonthFontFamily: 'Inter-Bold',
        todayTextColor: '#fff',
        selectedDayBackgroundColor: '#94a3b8',
        selectedDayTextColor: '#fff',
        backgroundColor: '#0f172a',
        calendarBackground: '#0f172a',
        dayTextColor: '#fff',
      }}
      onDayPress={onDayPress}
      markedDates={markedDates}
      onMonthChange={(date: any) =>
        onMonthChange && onMonthChange(new Date(date.dateString))
      }
    />
  );
};

export default CalendarComponent;
