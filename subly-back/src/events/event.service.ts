import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event-dto';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto, user: User) {
    const event = this.eventsRepository.create({
      ...dto,
      userId: user.id,
      user,
    });
    await this.eventsRepository.save(event);
    return this.eventsRepository.findOne({
      where: { id: event.id },
      relations: ['category', 'recurrence'],
    });
  }

  async findAllByUserId(userId: string) {
    const events = await this.eventsRepository.find({ where: { userId } });
    if (!events) {
      throw new NotFoundException('Événements introuvables');
    }

    return events;
  }

  async findOneById(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    return event;
  }

  async update(id: string, updateEventDto: Partial<UpdateEventDto>) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException('Event non trouvé');
    }
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOneById(id);
    return this.eventsRepository.remove(event);
  }
}
