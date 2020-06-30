import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  appointment_id: string;
  concluded: boolean;
}

@injectable()
class ConcludeAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointment_id,
    concluded,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    appointment.concluded = concluded;

    await this.appointmentsRepository.save(appointment);

    appointment.additionals.services = JSON.parse(
      appointment.additionals.services,
    );

    return appointment;
  }
}

export default ConcludeAppointmentService;
