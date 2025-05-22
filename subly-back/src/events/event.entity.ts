// import { Category } from 'src/categories/category.entity';
import { Category } from 'src/categories/category.entity';
import { Recurrence } from 'src/recurrence/recurrence.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum EventType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: 'EXPENSE',
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('uuid')
  recurrenceId: string;

  @ManyToOne(() => Recurrence, (r) => r.events, { nullable: false })
  @JoinColumn({ name: 'recurrenceId' })
  recurrence: Recurrence;

  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => Category, (c) => c.events, {
    nullable: false,
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (u) => u.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column('uuid')
  userId: string;
}
