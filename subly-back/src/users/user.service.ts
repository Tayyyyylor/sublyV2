import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateEventDto: Partial<UpdateUserDto>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User non trouvé');
    }
    Object.assign(user, updateEventDto);
    const updatedUser = await this.usersRepository.save(user);

    const payload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: updatedUser,
      access_token,
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
