import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

@injectable()
class ProviderDeleteAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(appointment_id: string): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    await this.appointmentsRepository.delete(appointment.id);
  }
}

export default ProviderDeleteAppointmentService;
