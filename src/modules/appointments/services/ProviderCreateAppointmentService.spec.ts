import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ProviderCreateAppointmentService from './ProviderCreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let providerCreateAppointment: ProviderCreateAppointmentService;

describe('ProviderCreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    providerCreateAppointment = new ProviderCreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment by provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 8).getTime();
    });

    const appointment = await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 15),
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte',
    });

    const appointment2 = await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 16),
      provider_id: 'provider2-id',
      service: 'corte e barba',
      foreign_client_name: 'Jose Da Silva',
    });

    await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 9),
      provider_id: 'provider3-id',
      user_id: 'user3-id',
      service: 'barba',
    });

    await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 10, 30),
      provider_id: 'provider4-id',
      user_id: 'user4-id',
      service: 'corte e hot towel',
    });

    await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 11, 30),
      provider_id: 'provider5-id',
      user_id: 'user5-id',
      service: 'hot towel',
    });

    await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 14, 30),
      provider_id: 'provider5-id',
      user_id: 'user5-id',
      service: 'pezinho',
    });

    await providerCreateAppointment.execute({
      date: new Date(2020, 4, 9, 15, 30),
      provider_id: 'provider5-id',
      user_id: 'user5-id',
      service: 'corte militar',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('additionals');
    expect(appointment.provider_id).toBe('123123');
    expect(appointment.user_id).toBe('logged-user');
    expect(appointment.service).toBe('corte');
    expect(appointment.price).toBe(25);

    expect(appointment2.foreign_client_name).toBe('Jose Da Silva');
    expect(appointment2).toHaveProperty('additionals');

    await expect(
      providerCreateAppointment.execute({
        date: new Date(2020, 4, 9, 14, 30),
        provider_id: 'provider5-id',
        user_id: 'user5-id',
        service: 'any for test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment at the same time as another', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 11, 14).getTime();
    });

    const appointmentDate = new Date(2020, 4, 11, 16);

    await providerCreateAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte e barba',
    });

    await expect(
      providerCreateAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: 'logged-user',
        service: 'barba',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 12, 13).getTime();
    });

    await expect(
      providerCreateAppointment.execute({
        date: new Date(2020, 4, 12, 14),
        provider_id: 'same-id',
        user_id: 'same-id',
        service: 'corte e hot towel',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
