import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Appointment from './Appointment';

@Entity('additionals')
class Additionals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appointment_id: string;

  @OneToOne(() => Appointment, appointment => appointment.additionals)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column('text')
  services: string;

  @Column('decimal')
  total_income: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Additionals;
