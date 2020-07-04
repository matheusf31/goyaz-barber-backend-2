import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

export type IAdditionalServices = Array<{
  description: string;
  value: number;
  quantity: number;
}>;

interface IRequest {
  description: string;
  appointment_id: string;
}

@injectable()
class UpdateAppointmentAdditionalsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    description,
    appointment_id,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    const additionalServices: IAdditionalServices = JSON.parse(
      appointment.additionals.services,
    );

    const findAdditionalServiceWithSameDescription = additionalServices.findIndex(
      service => service.description === description,
    );

    if (
      findAdditionalServiceWithSameDescription !== -1 &&
      additionalServices[findAdditionalServiceWithSameDescription].quantity > 1
    ) {
      additionalServices[
        findAdditionalServiceWithSameDescription
      ].quantity -= 1;
    } else {
      additionalServices.splice(findAdditionalServiceWithSameDescription, 1);
    }

    // recalcular o total
    const total_income = additionalServices.reduce(
      (accumulator, additionalService) =>
        accumulator + additionalService.value * additionalService.quantity,
      0,
    );

    appointment.additionals.total_income = total_income;
    appointment.additionals.services = JSON.stringify(additionalServices);

    await this.appointmentsRepository.save(appointment);

    appointment.additionals.services = JSON.parse(
      appointment.additionals.services,
    );

    return appointment;
  }
}

export default UpdateAppointmentAdditionalsService;
