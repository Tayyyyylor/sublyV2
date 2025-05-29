import { Module } from '@nestjs/common';
import { EventsService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './event.controller';
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
