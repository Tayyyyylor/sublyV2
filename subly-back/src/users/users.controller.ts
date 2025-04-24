import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
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

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
