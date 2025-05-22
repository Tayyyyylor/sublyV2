import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../event.entity';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsEnum(EventType, { message: 'Le type doit être EXPENSE ou INCOME' })
  type: EventType;

  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Le montant est obligatoire' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'La date de début est obligatoire' })
  @Type(() => Date)
  @IsDate({ message: 'Date de début invalide' })
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Date de fin invalide' })
  endDate?: Date;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsUUID()
  recurrenceId: string;
}
