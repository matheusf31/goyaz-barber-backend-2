import { injectable, inject } from 'tsyringe';
import {
  differenceInDays,
  formatRelative,
  format,
  subMinutes,
  isBefore,
} from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { HTTPError } from 'onesignal-node';

import AppError from '@shared/errors/AppError';
import { client } from '@shared/container/providers/OneSignal';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  appointment_id: string;
  logged_user_id: string;
}

@injectable()
class UserCancelAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
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

    const providerDeviceIds = await this.notificationsRepository.findDevicesById(
      appointment.provider_id,
    );

    if (providerDeviceIds.length === 0) {
      throw new AppError(
        'Esse prestador de serviços não está com o celular cadastrado.',
      );
    }

    let formattedDateBR = '';
    let formattedDateEN = '';

    if (differenceInDays(appointment.date, new Date()) >= 6) {
      formattedDateBR = format(appointment.date, 'dd/MM/RR - HH:mm', {
        locale: ptBR,
      });

      formattedDateEN = format(appointment.date, 'dd/MM/RR - HH:mm', {
        locale: enUS,
      });
    } else {
      formattedDateBR = formatRelative(appointment.date, new Date(), {
        locale: ptBR,
      });

      formattedDateEN = formatRelative(appointment.date, new Date(), {
        locale: enUS,
      });
    }

    const notification = {
      contents: {
        en: `Date: ${formattedDateEN}`,
        pt: `Data: ${formattedDateBR}`,
      },
      headings: {
        en: 'An appointment has been canceled!',
        pt: 'Um agendamento foi cancelado!',
      },
      include_player_ids: providerDeviceIds,
    };

    try {
      // const response = await client.createNotification(notification);
      await client.createNotification(notification);
      // console.log(response.body);
    } catch (e) {
      if (e instanceof HTTPError) {
        // When status code of HTTP response is not 2xx, HTTPError is thrown.
        console.log(e.statusCode);
        console.log(e.body);
      }
    }

    appointment.canceled_at = new Date(Date.now());

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default UserCancelAppointmentService;
