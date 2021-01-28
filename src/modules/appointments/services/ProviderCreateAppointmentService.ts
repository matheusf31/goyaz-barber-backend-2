import { injectable, inject } from 'tsyringe';
import { subHours, format, differenceInDays, formatRelative } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import { HTTPError } from 'onesignal-node';

import AppError from '@shared/errors/AppError';
import { client } from '@shared/container/providers/OneSignal';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
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

    // if (user_id) {
    //   const oneHourFromAppointmentDate = subHours(date, 1);

    //   let formattedDateBR = '';
    //   let formattedDateEN = '';

    //   if (differenceInDays(date, new Date()) >= 6) {
    //     formattedDateBR = format(date, 'dd/MM/RR - HH:mm', {
    //       locale: ptBR,
    //     });

    //     formattedDateEN = format(date, 'dd/MM/RR - HH:mm', {
    //       locale: enUS,
    //     });
    //   } else {
    //     formattedDateBR = formatRelative(date, new Date(), {
    //       locale: ptBR,
    //     });

    //     formattedDateEN = formatRelative(date, new Date(), {
    //       locale: enUS,
    //     });
    //   }

    //   const userDeviceIds = await this.notificationsRepository.findDevicesById(
    //     user_id,
    //   );

    //   if (userDeviceIds) {
    //     const notificationToClient: CreateNotificationBody = {
    //       contents: {
    //         en: `Date: ${formattedDateEN}`,
    //         pt: `Data marcada: ${formattedDateBR}`,
    //       },
    //       headings: {
    //         en: `You have a appointment today!`,
    //         pt: `Você possui um agendamento hoje!`,
    //       },
    //       include_player_ids: userDeviceIds,
    //       send_after: format(
    //         oneHourFromAppointmentDate,
    //         'ccc MMM dd yyyy pppp',
    //         { locale: ptBR },
    //       ),
    //     };

    //     try {
    //       // const response = await client.createNotification(notification);
    //       await client.createNotification(notificationToClient);
    //       // console.log(response.body);
    //     } catch (e) {
    //       if (e instanceof HTTPError) {
    //         // When status code of HTTP response is not 2xx, HTTPError is thrown.
    //         // console.log(e.statusCode);
    //         // console.log(e.body);
    //       }
    //     }
    //   }
    // }

    return appointment;
  }
}

export default ProviderCreateAppointmentService;
