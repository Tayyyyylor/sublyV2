import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  async create(
    name: string,
    amount: number,
    frequency: 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly',
    startDate: Date,
    creator: Users,
  ) {
    const event = this.eventsRepository.create({
      name,
      amount,
      frequency,
      startDate,
      creator,
    });
    return this.eventsRepository.save(event);
  }

  findAll() {
    return this.eventsRepository.find();
  }

  async findOne(name: string): Promise<Events | null> {
    const event = await this.eventsRepository.findOne({ where: { name } });
    return event;
  }
}
