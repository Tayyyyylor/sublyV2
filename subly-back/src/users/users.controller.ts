import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }
  @Get(':email')
  findOneByMail(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Post()
  create(
    @Body()
    body: {
      username: string;
      email: string;
      password: string;
    },
  ) {
    return this.usersService.create(body.username, body.email, body.password);
  }
}
