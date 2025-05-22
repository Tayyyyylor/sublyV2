import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Frequency } from '../recurrence.entity';

export class CreateRecurrenceDto {
  @IsNotEmpty({ message: 'La fréquence est obligatoire' })
  @IsEnum(Frequency, { message: 'Fréquence invalide' })
  frequency: Frequency;

  @IsNotEmpty({ message: 'La date de début est obligatoire' })
  @Type(() => Date)
  @IsDate({ message: 'Date de début invalide' })
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Date de fin invalide' })
  endDate?: Date;
}
