import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import UserCreateAppointmentService from './UserCreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let userCreateAppointment: UserCreateAppointmentService;

describe('UserCreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    userCreateAppointment = new UserCreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 8).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 9, 15),
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte',
    });

    const appointment2 = await userCreateAppointment.execute({
      date: new Date(2020, 4, 9, 16),
      provider_id: 'provider2-id',
      service: 'corte e barba',
      foreign_client_name: 'Jose Da Silva',
    });

    await userCreateAppointment.execute({
      date: new Date(2020, 4, 9, 9),
      provider_id: 'provider3-id',
      user_id: 'user3-id',
      service: 'barba',
    });

    await userCreateAppointment.execute({
      date: new Date(2020, 4, 9, 10, 30),
      provider_id: 'provider4-id',
      user_id: 'user4-id',
      service: 'corte e hot towel',
    });

    await userCreateAppointment.execute({
      date: new Date(2020, 4, 9, 11, 30),
      provider_id: 'provider5-id',
      user_id: 'user5-id',
      service: 'hot towel',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('additionals');
    expect(appointment.provider_id).toBe('123123');
    expect(appointment.user_id).toBe('logged-user');
    expect(appointment.service).toBe('corte');
    expect(appointment.price).toBe(25);

    expect(appointment2.foreign_client_name).toBe('Jose Da Silva');
    expect(appointment2).toHaveProperty('additionals');
  });

  it('should not be able to create a new appointment at the same time as another', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 11, 14).getTime();
    });

    const appointmentDate = new Date(2020, 4, 11, 16);

    await userCreateAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte e barba',
    });

    await expect(
      userCreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: 'logged-user',
        service: 'barba',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 14).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'hot towel',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 12, 13).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 12, 14),
        provider_id: 'same-id',
        user_id: 'same-id',
        service: 'corte e hot towel',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment before 9am and after 17pm in saturday', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 16, 8),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'hot towel',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 16, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment before 9am and after after 19pm in days of the week', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 11, 8),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 11, 20),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment on sunday', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 10, 14),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 10, 17),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment on sunday', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 11, 12).getTime();
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 17, 17),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a schedule if another one already exists in less than a week', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 11, 9).getTime();
    });

    const appointmentDate = new Date(2020, 4, 11, 10);

    await userCreateAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
      service: 'corte e barba',
    });

    await expect(
      userCreateAppointment.execute({
        date: new Date(2020, 4, 15, 14),
        provider_id: 'provider-id',
        user_id: 'user-id',
        service: 'corte e barba',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
