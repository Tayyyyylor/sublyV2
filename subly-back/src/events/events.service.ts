import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { UpdateEventDto } from './dto/update-event-dto';

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

  async findOneById(id: string): Promise<Events> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOneById(id);
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOneById(id);
    return this.eventsRepository.remove(event);
  }
}
