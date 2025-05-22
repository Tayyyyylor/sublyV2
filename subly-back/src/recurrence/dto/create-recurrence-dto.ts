import { IsEnum, IsNotEmpty } from 'class-validator';
import { Frequency } from '../recurrence.entity';

export class CreateRecurrenceDto {
  @IsNotEmpty({ message: 'La fréquence est obligatoire' })
  @IsEnum(Frequency, { message: 'Fréquence invalide' })
  frequency: Frequency;
}
