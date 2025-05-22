export type FrequencyType =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY';

export type EventType = {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  startDate: Date;
  endDate?: Date;
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};

export type TransacType = 'EXPENSE' | 'INCOME';
