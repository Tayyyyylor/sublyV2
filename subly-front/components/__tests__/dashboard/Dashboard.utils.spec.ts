import {
  doesEventOccurOnDate,
  generateMarkedDates,
  getDailyTotal,
} from '@/components/dashboard/Dashboard.utils';
import {
  CategoryType,
  EventType,
  Frequency,
  RecurrenceType,
} from '@/types/global';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';

describe('Dashboard.utils', () => {
  describe('getDailyTotal', () => {
    it('should calculate the net total for the day', () => {
      const events: EventType[] = [
        {
          id: '1',
          name: 'Event 1',
          startDate: new Date('2025-01-01T00:00:00.000Z'),
          amount: '100',
          type: 'INCOME',
          recurrence: { id: 'r1', frequency: 'DAILY' },
          category: { id: 'c1', name: 'Category 1', icon: '🍔' },
          userId: 'u1',
        },
        {
          id: '2',
          name: 'Event 2',
          startDate: new Date('2025-01-01T00:00:00.000Z'),
          amount: '40',
          type: 'EXPENSE',
          recurrence: { id: 'r1', frequency: 'DAILY' },
          category: { id: 'c2', name: 'Category 2', icon: '🍔' },
          userId: 'u1',
        },
      ];
      expect(getDailyTotal(events)).toBe(60);
    });

    it('should return zero without event', () => {
      expect(getDailyTotal([])).toBe(0);
    });
  });

  describe('doesEventOccurOnDate', () => {
    const baseDate = new Date('2025-01-01');

    const makeEvent = (start: Date, freq: Frequency, end?: Date): EventType => {
      const rec: RecurrenceType = { id: 'r1', frequency: freq };
      const cat: CategoryType = { id: 'c1', name: 'Category 1', icon: '🍔' };

      return {
        id: 'e1',
        name: 'Event 1',
        amount: '0',
        type: 'INCOME',
        startDate: start,
        endDate: end,
        category: cat,
        recurrence: rec,
        userId: 'u1',
      };
    };

    it('should return true if targetDate is exactly startDate', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      expect(
        doesEventOccurOnDate(
          ev,
          ev.startDate.toISOString().split('T')[0],
          ev.recurrence.frequency,
        ),
      ).toBe(true);
    });

    it('should return false if targetDate is before startDate', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      expect(doesEventOccurOnDate(ev, '2024-12-31', 'DAILY')).toBe(false);
    });

    it('should handle the DAILY recurrence', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      const target = addDays(baseDate, 3);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'DAILY'),
      ).toBe(true);
      const anotherDate = addDays(baseDate, 5);
      expect(
        doesEventOccurOnDate(
          ev,
          anotherDate.toISOString().split('T')[0],
          'DAILY',
        ),
      ).toBe(true);
    });

    it('should handle the WEEKLY recurrence', () => {
      const ev = makeEvent(baseDate, 'WEEKLY');
      const target = addWeeks(baseDate, 2);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'WEEKLY'),
      ).toBe(true);
    });

    it('should handle the MONTHLY recurrence', () => {
      const ev = makeEvent(baseDate, 'MONTHLY');
      const target = addMonths(baseDate, 1);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'MONTHLY'),
      ).toBe(true);
    });

    it('should handle the QUARTERLY recurrence', () => {
      const ev = makeEvent(baseDate, 'QUARTERLY');
      const target = addMonths(baseDate, 3);
      const targetStr = format(target, 'yyyy-MM-dd');
      expect(doesEventOccurOnDate(ev, targetStr, 'QUARTERLY')).toBe(true);
    });

    it('should handle the YEARLY recurrence', () => {
      const ev = makeEvent(baseDate, 'YEARLY');
      const target = addYears(baseDate, 1);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'YEARLY'),
      ).toBe(true);
    });

    it('should return false outside the date range (after endDate)', () => {
      const start = baseDate;
      const end = addDays(baseDate, 2);
      const ev = makeEvent(start, 'DAILY', end);
      const afterEnd = addDays(baseDate, 5);
      expect(
        doesEventOccurOnDate(ev, afterEnd.toISOString().split('T')[0], 'DAILY'),
      ).toBe(false);
    });
  });

  describe('generateMarkedDates', () => {
    const makeEvent = (
      start: Date,
      freq: Frequency,
      id: string,
      end?: Date,
    ): EventType => ({
      id,
      name: `Event ${id}`,
      startDate: start,
      endDate: end,
      recurrence: { id: `r${id}`, frequency: freq },
      amount: '0',
      type: 'INCOME',
      category: { id: 'c1', name: 'Category 1', icon: '🍔' },
      userId: 'u1',
    });

    const recs: RecurrenceType[] = [
      { id: 'r1', frequency: 'DAILY' as Frequency },
      { id: 'r2', frequency: 'WEEKLY' as Frequency },
    ];

    it('should mark the selected date as selected + grey', () => {
      const selected = '2025-01-10';
      const marked = generateMarkedDates([], recs, selected);
      expect(marked[selected]).toEqual({
        selected: true,
        selectedColor: 'grey',
      });
    });

    it('should add a dotColor for recurring events', () => {
      const start = new Date('2025-01-01');
      const end = addDays(start, 2);
      const ev1 = makeEvent(start, 'DAILY' as Frequency, '1', end);
      const testRecs: RecurrenceType[] = [
        { id: 'r1', frequency: 'DAILY' as Frequency },
      ];

      const marked = generateMarkedDates([ev1], testRecs, '2025-01-01');

      expect(marked['2025-01-01']).toBeDefined();
      expect(marked['2025-01-01'].selected).toBe(true);
      expect(marked['2025-01-01'].selectedColor).toBe('grey');
      expect(marked['2025-01-01'].marked).toBe(true);
      expect(marked['2025-01-01'].dotColor).toBe('#FBBF24');
    });
  });
});
