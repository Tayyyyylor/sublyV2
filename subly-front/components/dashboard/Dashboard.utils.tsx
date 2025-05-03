import { EventType } from '@/types/global';

export const getDailyTotal = (events: EventType[]) => {
  return events.reduce((sum: number, event: EventType) => {
    return sum + Number(event.amount);
  }, 0);
};

export const generateRecurringDates = (
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

export const generateMarkedDates = (
  events: EventType[],
  selectedDate: string,
) => {
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

export const doesEventOccurOnDate = (
  event: EventType,
  date: string,
): boolean => {
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
      const daysDiff = Math.floor((+selected - +start) / (1000 * 60 * 60 * 24));
      return daysDiff % 7 === 0;

    case 'trimestriel':
      const monthsDiff =
        (selected.getFullYear() - start.getFullYear()) * 12 +
        (selected.getMonth() - start.getMonth());
      return start.getDate() === selected.getDate() && monthsDiff % 3 === 0;

    case 'yearly':
      return (
        start.getDate() === selected.getDate() &&
        start.getMonth() === selected.getMonth()
      );

    default:
      return false;
  }
};

export const getMonthlyTotal = (
  events: EventType[],
  currentDate: Date,
): number => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return events.reduce((sum: number, event: EventType) => {
    // Générer toutes les occurrences de l'événement pour l'année en cours
    const yearEnd = new Date(currentYear, 11, 31); // 31 décembre de l'année courante
    const occurrences = generateRecurringDates(event, yearEnd);

    // Filtrer pour garder seulement les occurrences du mois courant
    const monthlyOccurrences = occurrences.filter((dateStr) => {
      const date = new Date(dateStr);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    // Ajouter le montant pour chaque occurrence du mois
    return sum + monthlyOccurrences.length * Number(event.amount);
  }, 0);
};
