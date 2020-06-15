import { getHours, isBefore, isSaturday, isSunday } from 'date-fns';
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
    | 'any for test';
  date: Date;
  foreign_client_name?: string;
}

@injectable()
class UserCreateAppointmentService {
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
    if (isBefore(date, Date.now())) {
      throw new AppError(
        'Você não pode criar um agendamento em uma data que já passou.',
      );
    }

    if (isSunday(date)) {
      throw new AppError('Você não pode fazer um agendamento no domingo.');
    }

    if (isSaturday(date) && (getHours(date) < 9 || getHours(date) > 17)) {
      throw new AppError(
        'Nos sábados você só pode fazer agendamentos entre as 9 e 17.',
      );
    }

    if (!isSaturday(date) && (getHours(date) < 9 || getHours(date) > 19)) {
      throw new AppError(
        'Nos dias de semana você só pode fazer agendamentos entre as 9 e 19.',
      );
    }

    if (user_id === provider_id) {
      throw new AppError('Você não pode marcar um agendamento consigo mesmo.');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      date,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Esse horário já está ocupado.');
    }

    const findAppointmentLessThanWeekFromToday = await this.appointmentsRepository.findLessThanWeek(
      provider_id,
    );

    if (findAppointmentLessThanWeekFromToday) {
      throw new AppError(
        'Você já possui um agendamento em menos de uma semana.',
      );
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

export default UserCreateAppointmentService;
