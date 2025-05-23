export type FrequencyType = {
  id: string;
  frequency: string;
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
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};

export type TransacType = 'EXPENSE' | 'INCOME';
