import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  AfterLoad,
} from 'typeorm';
import { isBefore } from 'date-fns';

import User from '@modules/users/infra/typeorm/entities/User';
import Additional from './Additional';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  service:
    | 'corte'
    | 'corte e barba'
    | 'barba'
    | 'hot towel'
    | 'corte e hot towel';

  @Column('decimal')
  price: number;

  past: boolean;

  @Column('boolean')
  concluded: boolean;

  @Column()
  foreign_client_name: string;

  @OneToOne(() => Additional, additional => additional.appointment, {
    cascade: true,
  })
  additionals: Additional;

  @Column('timestamp with time zone')
  canceled_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterLoad()
  getPast() {
    this.past = isBefore(this.date, new Date());
  }
}

export default Appointment;
