import { Event } from '../events/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  appleId?: string;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];
}
