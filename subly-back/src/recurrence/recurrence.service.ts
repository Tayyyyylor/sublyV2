import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recurrence } from './recurrence.entity';
import { CreateRecurrenceDto } from './dto/create-recurrence-dto';
import { UpdateRecurrenceDto } from './dto/update-recurrence.dto';

@Injectable()
export class RecurrenceService {
  constructor(
    @InjectRepository(Recurrence)
    private readonly recurrenceRepo: Repository<Recurrence>,
  ) {}

  async findAll(): Promise<Recurrence[]> {
    return this.recurrenceRepo.find();
  }

  async findOne(id: string): Promise<Recurrence> {
    const rec = await this.recurrenceRepo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException(`Récurrence ${id} introuvable`);
    return rec;
  }

  async create(dto: CreateRecurrenceDto): Promise<Recurrence> {
    const rec = this.recurrenceRepo.create(dto);
    return this.recurrenceRepo.save(rec);
  }
  async update(id: string, dto: UpdateRecurrenceDto): Promise<Recurrence> {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.recurrenceRepo.save(rec);
  }

  async remove(id: string): Promise<void> {
    const result = await this.recurrenceRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Récurrence ${id} introuvable`);
  }
}
