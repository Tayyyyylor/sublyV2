// src/categories/category.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Event } from 'src/events/event.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Event, (event) => event.categoryId)
  events: Event[];
}
