export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE';

export type FrequencyType = {
  id: string;
  frequency: Frequency
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
