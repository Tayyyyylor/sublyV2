import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recurrence } from './recurrence.entity';
import { RecurrenceService } from './recurrence.service';
import { RecurrenceController } from './recurrence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recurrence])],
  providers: [RecurrenceService],
  controllers: [RecurrenceController],
  exports: [RecurrenceService],
})
export class RecurrenceModule {}
