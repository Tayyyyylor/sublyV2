// src/categories/category.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Events } from 'src/events/events.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Events, (event) => event.category)
  events: Events[];
}
