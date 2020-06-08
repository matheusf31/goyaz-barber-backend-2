import { getHours, isBefore, isSaturday, isSunday } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  service:
    | 'corte'
    | 'corte e barba'
    | 'barba'
    | 'hot towel'
    | 'corte e hot towel'
    | 'any for test';
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    service,
    date,
  }: IRequest): Promise<Appointment> {
    /**
     * [x] verificar se o usuário selecionado é provedor
     * [x] extrair o preço baseado no service
     * [ ] verificar se o service foi inserido
     *
     * [x] colocar os minutos também (8:30)
     * [x] não deixar o usuário marcar horário no domingo
     * [x] impedir usuário de marcar fora dos horários estipulados

     */

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
        price = 25.0;
        break;

      case 'barba':
        price = 25.0;
        break;

      case 'corte e barba':
        price = 35.0;
        break;

      case 'hot towel':
        price = 25.0;
        break;

      case 'corte e hot towel':
        price = 35.0;
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
    });

    appointment.additionals.services = JSON.parse(
      appointment.additionals.services,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
