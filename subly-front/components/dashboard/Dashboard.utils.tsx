import { EventType, FrequencyType } from '@/types/global';
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isBefore,
  isSameMonth,
} from 'date-fns';

export const getDailyTotal = (events: EventType[]) => {
  return events.reduce((sum: number, event: EventType) => {
    const amount = Number(event.amount);
    return sum + (event.type === 'EXPENSE' ? -amount : amount);
  }, 0);
};

export const doesEventOccurOnDate = (
  event: EventType,
  targetDate: string,
  frequency: string,
): boolean => {
  const eventStartDate = new Date(event.startDate);
  const targetDateObj = new Date(targetDate);
  const endDate = event.endDate ? new Date(event.endDate) : undefined;

  if (isBefore(targetDateObj, eventStartDate)) {
    return false;
  }

  if (endDate && isBefore(endDate, targetDateObj)) {
    return false;
  }

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  const targetDateStr = formatDate(targetDateObj);
  const startDateStr = formatDate(eventStartDate);

  if (targetDateStr === startDateStr) {
    return true;
  }

  let currentDate = eventStartDate;
  while (isBefore(currentDate, targetDateObj)) {
    switch (frequency) {
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
      default:
        return false;
    }

    if (formatDate(currentDate) === targetDateStr) {
      return true;
    }
  }

  return false;
};

export const generateMarkedDates = (
  events: EventType[],
  recurrences: FrequencyType[],
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

  marked[selectedDate] = {
    selected: true,
    selectedColor: '#7c3aed', // violet-600
  };

  events.forEach((event) => {
    const recurrence = recurrences.find((r) => r.id === event.recurrenceId);
    if (!recurrence) return;

    const startDate = new Date(event.startDate);
    const endDate =
      event.endDate ||
      new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    let currentDate = startDate;
    while (isBefore(currentDate, endDate)) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');

      if (marked[dateKey]?.selected) {
        marked[dateKey] = {
          ...marked[dateKey],
          marked: true,
          dotColor: '#ef4444',
        };
      } else {
        marked[dateKey] = {
          marked: true,
          dotColor: '#ef4444',
        };
      }

      switch (recurrence.frequency) {
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
  });

  return marked;
};

export const getMonthlyTotal = (
  events: EventType[],
  currentMonth: Date,
  recurrences: FrequencyType[],
): number => {
  return events.reduce((total, event) => {
    const recurrence = recurrences.find((r) => r.id === event.recurrenceId);
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
