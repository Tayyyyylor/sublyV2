export type Frequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY'
  | 'ONCE';

export interface CategoryType {
  id: string;
  name: string;
  icon: string;
}

export interface RecurrenceType {
  id: string;
  frequency: Frequency;
}

export type TransacType = 'EXPENSE' | 'INCOME';

export interface EventType {
  id: string;
  name: string;
  amount: string;
  type: TransacType;
  startDate: Date;
  endDate?: Date;
  category: CategoryType;
  recurrence: RecurrenceType;
  userId: string;
}

export interface UserType {
  username: string;
  id: string;
}
