import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './event.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event-dto';
import { CreateEventDto } from './dto/create-event.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser() user: User, @Body() dto: CreateEventDto) {
    return this.eventsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
