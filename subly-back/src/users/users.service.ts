import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  create(firstName: string, lastName: string, email: string, password: string) {
    const users = this.usersRepository.create({
      firstName,
      lastName,
      email,
      password,
    });
    return this.usersRepository.save(users);
  }

  findAll() {
    return this.usersRepository.find();
  }
}
