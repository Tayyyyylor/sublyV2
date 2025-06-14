import { Event } from '../events/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Frequency {
  ONCE = 'ONCE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

@Entity('recurrences')
export class Recurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: Frequency.MONTHLY,
    type: 'simple-enum',
    enum: Frequency,
  })
  frequency: Frequency;

  @OneToMany(() => Event, (e) => e.recurrence)
  events: Event[];
}
