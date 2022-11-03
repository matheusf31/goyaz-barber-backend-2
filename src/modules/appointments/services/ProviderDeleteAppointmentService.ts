import { injectable, inject } from 'tsyringe';

import { client } from '@shared/container/providers/OneSignal';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

@injectable()
class ProviderDeleteAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(appointment_id: string): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('O agendamento não foi encontrado.');
    }

    // if (appointment.user_id) {
    //   const notificationId = await this.cacheProvider.recover<string>(
    //     `notification@client-id:${appointment.user_id}@appointment-id:${appointment.id}`,
    //   );

    //   if (notificationId) {
    //     await client.cancelNotification(notificationId);

    //     this.cacheProvider.invalidate(
    //       `notification@client-id:${appointment.user_id}@appointment-id:${appointment.id}`,
    //     );
    //   }
    // }

    await this.appointmentsRepository.delete(appointment.id);
  }
}

export default ProviderDeleteAppointmentService;
