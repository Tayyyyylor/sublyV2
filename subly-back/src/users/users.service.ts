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

  create(username: string, email: string, password: string) {
    const users = this.usersRepository.create({
      username,
      email,
      password,
    });
    return this.usersRepository.save(users);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<Users | null> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }

  async findOneByMail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
