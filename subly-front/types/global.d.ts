export type FrequencyType = {
  id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
};

export type EventType = {
  id: string;
  name: string;
  amount: number;
  type: TransacType;
  recurrenceId: string;
  categoryId: string;
  startDate: Date;
  endDate?: Date;
  category?: CategoryType;
  recurrence?: FrequencyType;
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};

export type TransacType = 'EXPENSE' | 'INCOME';
