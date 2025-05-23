import { TransacType } from './global';

export interface CreateEventPayload {
  name: string;
  amount: number;
  type: TransacType;
  startDate: Date;
  endDate?: Date;
  categoryId: string;
  recurrenceId: string;
}
