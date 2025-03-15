import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto.username, signInDto.password);
  }

  // @Post('oauth/apple')
  // async appleLogin(@Body('token') token: string) {
  //   return this.authService.loginWithApple(token);
  // }
}
