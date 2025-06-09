import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le pseudo est obligatoire' })
  username: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Le mot de passe doit contenir au moins une majuscule',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Le mot de passe doit contenir au moins une minuscule',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Le mot de passe doit contenir un caractère spécial (@$!%*?&)',
  })
  password: string;
}
