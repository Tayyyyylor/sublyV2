import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
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

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsUUID()
  recurrenceId: string;
}
