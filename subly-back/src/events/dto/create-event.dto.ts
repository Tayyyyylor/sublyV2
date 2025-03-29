export class CreateEventDto {
  name: string;
  amount: number;
  frequency: 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly';
  startDate: string;
}
