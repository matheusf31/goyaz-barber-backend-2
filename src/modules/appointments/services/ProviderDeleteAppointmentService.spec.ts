import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeUnavailablesRepository from '@modules/unavailables/repositories/fakes/FakeUnavailablesRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import UserCreateAppointmentService from './UserCreateAppointmentService';
import ProviderDeleteAppointmentService from './ProviderDeleteAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUnavailablesRepository: FakeUnavailablesRepository;
let fakeCacheProvider: FakeCacheProvider;
let userCreateAppointment: UserCreateAppointmentService;
let providerDeleteAppointmentService: ProviderDeleteAppointmentService;

describe('ProviderDeleteAppointment', () => {
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

    providerDeleteAppointmentService = new ProviderDeleteAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123456',
      user_id: 'logged-user',
      service: 'corte',
    });

    await providerDeleteAppointmentService.execute(appointment.id);

    const deletedAppointment = await fakeAppointmentsRepository.findById(
      appointment.id,
    );

    expect(deletedAppointment).toBe(undefined);
  });

  it('should not be able to delete a non existing appointment', async () => {
    await expect(
      providerDeleteAppointmentService.execute('non-existing-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
