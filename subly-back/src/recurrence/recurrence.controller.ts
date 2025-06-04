import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecurrenceService } from './recurrence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recurrences')
@UseGuards(JwtAuthGuard)
export class RecurrenceController {
  constructor(private readonly recService: RecurrenceService) {}

  /**
   * GET /recurrences
   * Retourne la liste des fréquences disponibles (exhaustive, définie par l'admin)
   */
  @Get()
  findAll() {
    return this.recService.findAll();
  }

  /**
   * GET /recurrences/:id
   * Retourne les détails d'une fréquence
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recService.findOne(id);
  }
}
