import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import UserCreateAppointmentService from './UserCreateAppointmentService';
import ConcludeAppointmentService from './ConcludeAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let userCreateAppointment: UserCreateAppointmentService;
let concludeAppointment: ConcludeAppointmentService;

describe('ConcludeAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    userCreateAppointment = new UserCreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );

    concludeAppointment = new ConcludeAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to conclude a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123456',
      user_id: 'logged-user',
      service: 'corte',
    });

    await concludeAppointment.execute({
      appointment_id: appointment.id,
      concluded: true,
    });

    expect(appointment.concluded).toBe(true);

    await concludeAppointment.execute({
      appointment_id: appointment.id,
      concluded: false,
    });

    expect(appointment.concluded).toBe(false);
  });

  it('should not be able to conclude a non existing appointment', async () => {
    await expect(
      concludeAppointment.execute({
        appointment_id: 'non-existing-appointment-id',
        concluded: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
