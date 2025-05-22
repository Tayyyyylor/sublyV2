import { Event } from 'src/events/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

@Entity('recurrences')
export class Recurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: 'MONTHLY',
    type: 'enum',
    enum: Frequency,
  })
  frequency: Frequency;

  @Column('timestamptz')
  startDate: Date;

  @Column('timestamptz', { nullable: true })
  endDate?: Date;

  @OneToMany(() => Event, (e) => e.recurrence)
  events: Event[];
}
