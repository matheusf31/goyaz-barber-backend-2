import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeUnavailablesRepository from '@modules/unavailables/repositories/fakes/FakeUnavailablesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import UserCreateAppointmentService from './UserCreateAppointmentService';
import UserCancelAppointmentService from './UserCancelAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUnavailablesRepository: FakeUnavailablesRepository;
let fakeCacheProvider: FakeCacheProvider;
let userCreateAppointment: UserCreateAppointmentService;
let userCancelAppointment: UserCancelAppointmentService;

describe('UserCancelAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUnavailablesRepository = new FakeUnavailablesRepository();

    userCreateAppointment = new UserCreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
      fakeUnavailablesRepository,
    );

    userCancelAppointment = new UserCancelAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to cancel a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123456',
      user_id: 'logged-user',
      service: 'corte',
    });

    await userCancelAppointment.execute({
      appointment_id: appointment.id,
      logged_user_id: 'logged-user',
    });

    expect(appointment.canceled_at.getTime()).toBe(
      new Date(2020, 4, 9, 10).getTime(),
    );
  });

  it('should not be able to cancel a non existing appointment', async () => {
    await expect(
      userCancelAppointment.execute({
        appointment_id: 'any',
        logged_user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to cancel a appointment from another user', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123456',
      user_id: 'logged-user',
      service: 'corte',
    });

    await expect(
      userCancelAppointment.execute({
        appointment_id: appointment.id,
        logged_user_id: 'another-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to cancel a appointment less than thirty minutes before', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 13, 10, 10, 0).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 10, 10, 30, 0),
      provider_id: '123456',
      user_id: 'logged-user',
      service: 'corte',
    });

    await expect(
      userCancelAppointment.execute({
        appointment_id: appointment.id,
        logged_user_id: 'logged-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
