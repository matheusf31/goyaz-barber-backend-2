import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import UpdateAppointmentAdditionalsService from './UpdateAppointmentAdditionalsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let updateAppointmentAdditionals: UpdateAppointmentAdditionalsService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    updateAppointmentAdditionals = new UpdateAppointmentAdditionalsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to update appointment additionals', async () => {
    const appointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      date: new Date(2020, 4, 5, 14, 0, 0),
      user_id: 'any',
      service: 'corte',
      price: 25,
    });

    const appointmentAdditionals = await updateAppointmentAdditionals.execute({
      appointment_id: appointment.id,
      provider_id: 'provider-id',
      additional: {
        description: 'cerveja',
        value: 7.5,
      },
    });

    appointmentAdditionals.additionals.services = JSON.parse(
      appointmentAdditionals.additionals.services,
    );

    const additionalService = appointmentAdditionals.additionals.services[0];

    expect(additionalService).toHaveProperty('description');
    expect(additionalService).toHaveProperty('value');
    expect(appointmentAdditionals.additionals.total_income).toBe(7.5);
  });

  it('should not be able to update additionals from a non existing appointment', async () => {
    await expect(
      updateAppointmentAdditionals.execute({
        appointment_id: 'non-existing',
        provider_id: 'provider-id',
        additional: {
          description: 'cerveja',
          value: 7.5,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update appointment additionals from another provider', async () => {
    const appointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      date: new Date(2020, 4, 5, 14, 0, 0),
      user_id: 'any',
      service: 'corte',
      price: 25,
    });

    await expect(
      updateAppointmentAdditionals.execute({
        appointment_id: appointment.id,
        provider_id: 'another-provider-id',
        additional: {
          description: 'cerveja',
          value: 7.5,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
