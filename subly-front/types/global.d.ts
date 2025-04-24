export type FrequencyType =
  | 'one'
  | 'hebdo'
  | 'monthly'
  | 'trimestriel'
  | 'yearly';

export type EventType = {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  startDate: Date;
  endDate?: Date;
};
