import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  service: 'corte' | 'corte e barba' | 'barba' | 'hot towel';
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
     * [ ] verificar se o usuário selecionado é provedor
     * [x] extrair o preço baseado no service
     * [x] verificar se o service foi inserido
     *
     * [x] colocar os minutos também (8:30)
     * [x] não deixar o usuário marcar horário no domingo
     * [ ] impedir usuário de marcar fora dos horários estipulados
     * [ ] verificar se o hot towel é 1 hora
     * [ ] verificar se o provider está com aquela hora marcada como OCUPADO
     * [ ] verificar se o dia foi marcado como indisponível
     */

    /**
     * ALTERAR AQUI
     */
    const appointmentDate = startOfHour(date); // allowed times: 8:00, 9:00, 10:00... (regra de negócio)

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Esse horário já está ocupado.');
    }

    if (!provider_id) {
      throw new AppError('Nenhum barbeiro foi selecionado.');
    }

    if (!service) {
      throw new AppError('Nenhum serviço foi selecionado.');
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

      default:
        price = 0;
        break;
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      service,
      price,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
