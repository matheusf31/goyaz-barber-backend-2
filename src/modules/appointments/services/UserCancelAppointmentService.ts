import { injectable, inject } from 'tsyringe';
import { subMinutes, isBefore } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  appointment_id: string;
  logged_user_id: string;
}

@injectable()
class UserCancelAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointment_id,
    logged_user_id,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    const appointmentDateSubThirtyMinutes = subMinutes(appointment.date, 30);

    if (
      appointment.user_id !== logged_user_id &&
      appointment.provider_id !== logged_user_id
    ) {
      throw new AppError('Você não pode cancelar esse agendamento.');
    }

    if (
      appointment.user_id === logged_user_id &&
      isBefore(appointmentDateSubThirtyMinutes, new Date(Date.now()))
    ) {
      throw new AppError(
        'Você não pode mais desmarcar o agendamento, ligue para o barbeiro.',
      );
    }

    appointment.canceled_at = new Date(Date.now());

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default UserCancelAppointmentService;
