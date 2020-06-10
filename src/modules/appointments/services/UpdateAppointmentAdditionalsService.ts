import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type IAdditionalServices = Array<{
  description: string;
  value: number;
}>;

interface IAdditional {
  description: string;
  value: number;
}

interface IRequest {
  additional: IAdditional;
  appointment_id: string;
  provider_id: string;
}

@injectable()
class UpdateAppointmentAdditionalsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    additional,
    appointment_id,
    provider_id,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    if (appointment.provider_id !== provider_id) {
      throw new AppError('Você não pode alterar esse agendamento.');
    }

    const additionalServices: IAdditionalServices = JSON.parse(
      appointment.additionals.services,
    );

    additionalServices.push(additional);

    const total_income = additionalServices.reduce(
      (accumulator, additionalService) => accumulator + additionalService.value,
      0,
    );

    appointment.additionals.total_income = total_income;
    appointment.additionals.services = JSON.stringify(additionalServices);

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default UpdateAppointmentAdditionalsService;
