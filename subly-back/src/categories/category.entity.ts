// import { Events } from 'src/events/events.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  //   @OneToMany(() => Events, (event) => event.category)
  //   events: Events[];
}
