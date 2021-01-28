import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id?: string;
  service:
    | 'corte'
    | 'corte e barba'
    | 'barba'
    | 'hot towel'
    | 'corte e hot towel'
    | 'pezinho'
    | 'corte militar'
    | 'any for test';
  date: Date;
  foreign_client_name?: string;
}

@injectable()
class ProviderCreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    service,
    date,
    foreign_client_name,
  }: IRequest): Promise<Appointment> {
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      date,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Esse horário já está ocupado.');
    }

    if (user_id === provider_id) {
      throw new AppError('Você não pode marcar um agendamento consigo mesmo.');
    }

    let price: number;

    switch (service) {
      case 'corte':
        price = 25;
        break;

      case 'barba':
        price = 18;
        break;

      case 'corte e barba':
        price = 35;
        break;

      case 'hot towel':
        price = 25;
        break;

      case 'pezinho':
        price = 10;
        break;

      case 'corte militar':
        price = 15;
        break;

      case 'corte e hot towel':
        price = 45;
        break;

      default:
        throw new AppError('Serviço inválido.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      service,
      price,
      date,
      foreign_client_name,
    });

    return appointment;
  }
}

export default ProviderCreateAppointmentService;
