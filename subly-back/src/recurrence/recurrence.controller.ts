import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecurrenceService } from './recurrence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recurrences')
@UseGuards(JwtAuthGuard)
export class RecurrenceController {
  constructor(private readonly recService: RecurrenceService) {}

  @Get()
  findAll() {
    return this.recService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recService.findOne(id);
  }
}
