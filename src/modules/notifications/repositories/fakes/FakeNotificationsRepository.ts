import { uuid } from 'uuidv4';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/entities/Notification';

class NotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [
    {
      id: uuid(),
      device_id: 'any',
      user_id: '123456',
    } as Notification,
  ];

  public async create({
    device_id,
    user_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: uuid(),
      device_id,
      user_id,
    });

    this.notifications.push(notification);

    return notification;
  }

  public async findDevicesById(user_id: string): Promise<string[]> {
    const devices = this.notifications.filter(
      notification => notification.user_id === user_id,
    );

    if (devices.length > 0) {
      const formattedDevices = devices.map(device => device.device_id);

      return formattedDevices;
    }

    return [];
  }
}

export default NotificationsRepository;
