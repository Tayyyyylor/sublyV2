import { EventType, Frequency, RecurrenceType } from '@/types/global';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isBefore,
  isSameMonth,
} from 'date-fns';

export const today = new Date();
today.setHours(0, 0, 0, 0);

export const getMonthlyTotal = (
  events: EventType[],
  currentMonth: Date,
  recurrences: RecurrenceType[],
): number => {
  return events.reduce((total, event) => {
    const recurrence = recurrences.find((r) => r.id === event.recurrence.id);
    if (!recurrence) return total;

    const startDate = new Date(event.startDate);
    const endDate =
      event.endDate ||
      new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    let currentDate = startDate;
    let monthlyAmount = 0;

    while (isBefore(currentDate, endDate)) {
      if (isSameMonth(currentDate, currentMonth)) {
        monthlyAmount +=
          Number(event.amount) * (event.type === 'EXPENSE' ? -1 : 1);
      }

      switch (recurrence.frequency) {
        case 'ONCE':
          currentDate = new Date(endDate.getTime());
          currentDate.setDate(currentDate.getDate() + 1);
          break;
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
      }
    }

    return total + monthlyAmount;
  }, 0);
};

export const translateFrequency = (frequency: Frequency): string => {
  const translations: Record<Frequency, string> = {
    ONCE: 'UNE FOIS',
    DAILY: 'JOURNALIER',
    WEEKLY: 'HEBDOMADAIRE',
    MONTHLY: 'MENSUEL',
    QUARTERLY: 'TRIMESTRIEL',
    YEARLY: 'ANNUEL',
  };
  return translations[frequency];
};
