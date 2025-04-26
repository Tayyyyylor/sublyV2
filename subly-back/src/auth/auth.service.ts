import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password as string);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}
