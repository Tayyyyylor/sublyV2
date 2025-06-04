// components/__tests__/dashboard/Dashboard.utils.spec.ts

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
    it('calcul le total net pour la journée', () => {
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

    it('retourne zero sans evenement', () => {
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

    it('renvoie true si targetDate est exactement startDate', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      expect(
        doesEventOccurOnDate(
          ev,
          ev.startDate.toISOString().split('T')[0],
          ev.recurrence.frequency,
        ),
      ).toBe(true);
    });

    it('renvoie false si targetDate est avant startDate', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      expect(doesEventOccurOnDate(ev, '2024-12-31', 'DAILY')).toBe(false);
    });

    it('gère la récurrence DAILY', () => {
      const ev = makeEvent(baseDate, 'DAILY');
      // Test avec une date dans la séquence
      const target = addDays(baseDate, 3);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'DAILY'),
      ).toBe(true);
      // Test avec une autre date dans la séquence
      const anotherDate = addDays(baseDate, 5);
      expect(
        doesEventOccurOnDate(
          ev,
          anotherDate.toISOString().split('T')[0],
          'DAILY',
        ),
      ).toBe(true);
    });

    it('gère la récurrence WEEKLY', () => {
      const ev = makeEvent(baseDate, 'WEEKLY');
      const target = addWeeks(baseDate, 2);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'WEEKLY'),
      ).toBe(true);
    });

    it('gère la récurrence MONTHLY', () => {
      const ev = makeEvent(baseDate, 'MONTHLY');
      const target = addMonths(baseDate, 1);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'MONTHLY'),
      ).toBe(true);
    });

    it('gère la récurrence QUARTERLY', () => {
      const ev = makeEvent(baseDate, 'QUARTERLY');
      // Test avec exactement 3 mois plus tard
      const target = addMonths(baseDate, 3);
      const targetStr = format(target, 'yyyy-MM-dd');
      expect(doesEventOccurOnDate(ev, targetStr, 'QUARTERLY')).toBe(true);
    });

    it('gère la récurrence YEARLY', () => {
      const ev = makeEvent(baseDate, 'YEARLY');
      const target = addYears(baseDate, 1);
      expect(
        doesEventOccurOnDate(ev, target.toISOString().split('T')[0], 'YEARLY'),
      ).toBe(true);
    });

    it('renvoie false hors périmètre de dates (après endDate)', () => {
      const start = baseDate;
      const end = addDays(baseDate, 2);
      const ev = makeEvent(start, 'DAILY', end);
      // 5 jours après, hors endDate
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

    it('marque la date sélectionnée en selected + grey', () => {
      const selected = '2025-01-10';
      const marked = generateMarkedDates([], recs, selected);
      expect(marked[selected]).toEqual({
        selected: true,
        selectedColor: 'grey',
      });
    });

    it('ajoute un dotColor pour les événements récurrents', () => {
      const start = new Date('2025-01-01');
      const end = addDays(start, 2);
      const ev1 = makeEvent(start, 'DAILY' as Frequency, '1', end);
      const testRecs: RecurrenceType[] = [
        { id: 'r1', frequency: 'DAILY' as Frequency },
      ];

      const marked = generateMarkedDates([ev1], testRecs, '2025-01-01');

      // Vérifions seulement la date sélectionnée
      expect(marked['2025-01-01']).toBeDefined();
      expect(marked['2025-01-01'].selected).toBe(true);
      expect(marked['2025-01-01'].selectedColor).toBe('grey');
      expect(marked['2025-01-01'].marked).toBe(true);
      expect(marked['2025-01-01'].dotColor).toBe('#FBBF24');
    });
  });
});
