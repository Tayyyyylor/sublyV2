import { EventType } from '@/types/global';

export const getPieChartData = (
  events: EventType[],
  type: 'EXPENSE' | 'INCOME',
) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#8E44AD',
  ];

  const grouped: Record<
    string,
    {
      label: string;
      value: number;
      color: string;
    }
  > = {};

  events.forEach((event, index) => {
    if (event.type !== type) return;

    const amount = parseFloat(event.amount);
    if (isNaN(amount)) return;

    const category = event.category;
    if (!grouped[category.id]) {
      grouped[category.id] = {
        label: category.name,
        value: 0,
        color: generateColor(index),
      };
    }

    grouped[category.id].value += amount;
  });

  return Object.values(grouped);
};

export const generateColor = (index: number) => {
  const hue = (index * 137.508) % 360; // nombre premier pour bien répartir les couleurs
  return `hsl(${hue}, 70%, 50%)`;
};

export const getBalancePieData = (events: EventType[]) => {
  let income = 0;
  let expense = 0;

  events.forEach((event) => {
    const amount = parseFloat(event.amount);
    if (isNaN(amount)) return;

    if (event.type === 'INCOME') {
      income += amount;
    } else if (event.type === 'EXPENSE') {
      expense += amount;
    }
  });

  return [
    { value: income, color: '#4CAF50', text: 'Revenus' },
    { value: expense, color: '#F44336', text: 'Dépenses' },
  ];
};
