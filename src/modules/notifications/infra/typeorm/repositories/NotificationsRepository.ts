import { getRepository, Repository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../entities/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: Repository<Notification>;

  constructor() {
    this.ormRepository = getRepository(Notification);
  }

  public async create({
    device_id,
    user_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      device_id,
      user_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  public async findDevicesById(user_id: string): Promise<string[]> {
    const devices = await this.ormRepository.find({
      where: {
        user_id,
      },
      select: ['device_id'],
    });

    if (devices.length > 0) {
      const formattedDevices = devices.map(device => device.device_id);

      return formattedDevices;
    }

    return [];
  }
}

export default NotificationsRepository;
