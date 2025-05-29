import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @IsNotEmpty({ message: 'L’icône est obligatoire' })
  @IsString({ message: 'L’icône doit être une chaîne de caractères' })
  icon: string;
}
