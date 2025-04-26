import { Users } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Events {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    default: 'monthly',
    type: 'enum',
    enum: ['one', 'hebdo', 'monthly', 'trimestriel', 'yearly'],
  })
  frequency: 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly';

  @Column('timestamptz')
  startDate: Date;

  @Column('timestamptz', { nullable: true })
  endDate?: Date;

  @ManyToOne(() => Users, (user) => user.events)
  creator: Users;
}
