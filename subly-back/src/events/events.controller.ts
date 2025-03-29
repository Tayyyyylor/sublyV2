import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Users } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.eventsService.findOne(name);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    body: {
      name: string;
      amount: number;
      frequency: 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly';
      startDate: string | Date;
      creator: Users;
    },
  ) {
    const startDate =
      typeof body.startDate === 'string'
        ? new Date(body.startDate)
        : body.startDate;

    return this.eventsService.create(
      body.name,
      body.amount,
      body.frequency,
      startDate,
      body.creator,
    );
  }
}
