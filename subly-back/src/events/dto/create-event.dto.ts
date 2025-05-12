import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Le montant est obligatoire' })
  @IsNumber()
  amount: number;

  @IsEnum(['one', 'hebdo', 'monthly', 'trimestriel', 'yearly'], {
    message: 'Fréquence invalide',
  })
  frequency: 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly';

  @IsDateString({}, { message: 'Date de début invalide' })
  startDate: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
