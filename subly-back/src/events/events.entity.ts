// import { Category } from 'src/categories/category.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  // JoinColumn,
} from 'typeorm';

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

  // @ManyToOne(() => Category, (category) => category.events, {
  //   eager: true,
  //   nullable: false,
  // })
  // @JoinColumn({ name: 'categoryId' })
  // category: Category;

  @ManyToOne(() => Users, (user) => user.events)
  creator: Users;
}
