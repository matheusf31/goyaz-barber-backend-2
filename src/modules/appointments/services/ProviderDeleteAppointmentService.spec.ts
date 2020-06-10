import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import UserCreateAppointmentService from './UserCreateAppointmentService';
import ProviderDeleteAppointmentService from './ProviderDeleteAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let userCreateAppointment: UserCreateAppointmentService;
let providerDeleteAppointmentService: ProviderDeleteAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    userCreateAppointment = new UserCreateAppointmentService(
      fakeAppointmentsRepository,
    );

    providerDeleteAppointmentService = new ProviderDeleteAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to delete a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await userCreateAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123123',
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
