import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(username: string, email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.usersRepository.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<Users | null> {
    const normalizedEmail = email.toLowerCase();
    return await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
