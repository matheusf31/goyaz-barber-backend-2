import {
  formatRelative,
  getHours,
  isBefore,
  isSaturday,
  isSunday,
  differenceInDays,
  format,
  addMinutes,
  // subHours,
  // differenceInSeconds,
  // differenceInMinutes,
} from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { HTTPError } from 'onesignal-node';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { client } from '@shared/container/providers/OneSignal';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUnavailablesRepository from '@modules/unavailables/repositories/IUnavailablesRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  user_id: string;
  service:
    | 'corte'
    | 'corte e barba'
    | 'barba'
    | 'hot towel'
    | 'pezinho'
    | 'corte militar'
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('UnavailablesRepository')
    private unavailablesRepository: IUnavailablesRepository,
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

    if (findAppointmentInSameDate && !findAppointmentInSameDate.canceled_at) {
      throw new AppError('Esse horário já está ocupado.');
    }

    if (service === 'corte e barba' || service === 'corte e hot towel') {
      const findAppointmentThirtyMinutesLater = await this.appointmentsRepository.findByDate(
        addMinutes(date, 30),
        provider_id,
      );

      const findUnavailableThirtyMinutesLater = await this.unavailablesRepository.findUnavailableByDate(
        {
          provider_id,
          date: addMinutes(date, 30),
        },
      );

      if (
        (findAppointmentThirtyMinutesLater &&
          !findAppointmentThirtyMinutesLater.canceled_at) ||
        (findUnavailableThirtyMinutesLater &&
          findUnavailableThirtyMinutesLater.is_unavailable)
      ) {
        throw new AppError(
          'Horário disponível apenas para procedimentos de 30 minutos. Por gentileza, tente outro horário.',
        );
      }
    }

    const findAppointment = await this.appointmentsRepository.findExistentUserAppointment(
      user_id,
    );

    if (findAppointment) {
      const dateFormatted = format(
        findAppointment.date,
        "dd/MM 'às' HH:mm 'horas'",
      );

      throw new AppError(
        `Você já possui um agendamento para o dia ${dateFormatted}.`,
      );
    }

    let price: number;

    switch (service) {
      case 'corte':
        price = 30;
        break;

      case 'barba':
        price = 20;
        break;

      case 'corte e barba':
        price = 40;
        break;

      case 'hot towel':
        price = 30;
        break;

      case 'pezinho':
        price = 10;
        break;

      case 'corte militar':
        price = 15;
        break;

      case 'corte e hot towel':
        price = 50;
        break;

      default:
        throw new AppError('Serviço inválido.');
    }

    const providerDeviceIds = await this.notificationsRepository.findDevicesById(
      provider_id,
    );

    // const userDeviceIds = await this.notificationsRepository.findDevicesById(
    //   user_id,
    // );

    if (providerDeviceIds.length === 0) {
      throw new AppError(
        'Esse prestador de service não está com o celular cadastrado.',
      );
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      service,
      price,
      date,
      foreign_client_name,
    });

    let formattedDateBR = '';
    let formattedDateEN = '';

    if (differenceInDays(date, new Date()) >= 6) {
      formattedDateBR = format(date, 'dd/MM/RR - HH:mm', {
        locale: ptBR,
      });

      formattedDateEN = format(date, 'dd/MM/RR - HH:mm', {
        locale: enUS,
      });
    } else {
      formattedDateBR = formatRelative(date, new Date(), {
        locale: ptBR,
      });

      formattedDateEN = formatRelative(date, new Date(), {
        locale: enUS,
      });
    }

    const notificationToProvider: CreateNotificationBody = {
      contents: {
        en: `Date: ${formattedDateEN}`,
        pt: `Data: ${formattedDateBR}`,
      },
      headings: {
        en: 'You have a new appointment!',
        pt: 'Você tem um novo agendamento!',
      },
      include_player_ids: providerDeviceIds,
    };

    try {
      await client.createNotification(notificationToProvider);

      // if (
      //   userDeviceIds &&
      //   differenceInMinutes(appointment.date, new Date()) > 60
      // ) {
      //   const oneHourFromAppointmentDate = subHours(date, 1);

      //   const notificationToClient: CreateNotificationBody = {
      //     contents: {
      //       en: `Appointment schedule to: ${formattedDateEN}. Avoid delays, please arrive in advance.`,
      //       pt: `Agendamento marcado para ${formattedDateBR}. Evite atrasos, por gentileza chegue com antecedência.`,
      //     },
      //     headings: {
      //       en: `You have a appointment today!`,
      //       pt: `Você possui um agendamento hoje!`,
      //     },
      //     include_player_ids: userDeviceIds,
      //     send_after: format(
      //       oneHourFromAppointmentDate,
      //       'ccc MMM dd yyyy pppp',
      //       {
      //         locale: ptBR,
      //       },
      //     ),
      //   };

      //   const response = await client.createNotification(notificationToClient);

      //   await this.cacheProvider.save(
      //     `notification@client-id:${user_id}@appointment-id:${appointment.id}`,
      //     response.body.id,
      //     'EX',
      //     differenceInSeconds(appointment.date, new Date()),
      //   );
      // }
    } catch (e) {
      if (e instanceof HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        // console.log(e.statusCode);
        // console.log(e.body);
      }
    }

    return appointment;
  }
}

export default UserCreateAppointmentService;
