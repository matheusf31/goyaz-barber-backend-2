import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import UserCreateAppointmentService from './UserCreateAppointmentService';
import UserCancelAppointmentService from './UserCancelAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let userCreateAppointment: UserCreateAppointmentService;
let userCancelAppointment: UserCancelAppointmentService;

describe('UserCancelAppointiment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    userCreateAppointment = new UserCreateAppointmentService(
      fakeAppointmentsRepository,
    );

    userCancelAppointment = new UserCancelAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to cancel a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte',
    });

    await userCancelAppointment.execute({
      appointment_id: appointment.id,
      logged_user_id: '123123',
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
      provider_id: '123123',
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
      provider_id: '123123',
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
