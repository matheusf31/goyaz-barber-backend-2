import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import UpdateAppointmentAdditionalsService from './UpdateAppointmentAdditionalsService';
import DeleteAppointmentAdditionalsService from './DeleteAppointmentAdditionalsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let updateAppointmentAdditionals: UpdateAppointmentAdditionalsService;
let deleteAppointmentAdditionals: DeleteAppointmentAdditionalsService;

interface IService {
  description: string;
  value: number;
  quantity: number;
}

describe('UpdateAppointmentAdditionals', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    updateAppointmentAdditionals = new UpdateAppointmentAdditionalsService(
      fakeAppointmentsRepository,
    );

    deleteAppointmentAdditionals = new DeleteAppointmentAdditionalsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to delete appointment additionals service', async () => {
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
        quantity: 1,
      },
    });

    await deleteAppointmentAdditionals.execute({
      appointment_id: appointment.id,
      description: 'cerveja',
    });

    expect(appointmentAdditionals.additionals.total_income).toBe(0);
    expect(appointmentAdditionals.additionals.services).toEqual([]);
  });

  it('should be able to decrease appointment additionals service quantity', async () => {
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
        quantity: 1,
      },
    });

    await updateAppointmentAdditionals.execute({
      appointment_id: appointment.id,
      provider_id: 'provider-id',
      additional: {
        description: 'cerveja',
        value: 7.5,
        quantity: 1,
      },
    });

    await deleteAppointmentAdditionals.execute({
      appointment_id: appointment.id,
      description: 'cerveja',
    });

    const additionalService = (appointmentAdditionals.additionals
      .services[0] as unknown) as IService;

    expect(appointmentAdditionals.additionals.total_income).toBe(7.5);
    expect(additionalService.quantity).toBe(1);
  });

  it('should not be able to delete additionals service from a non existing appointment', async () => {
    await expect(
      deleteAppointmentAdditionals.execute({
        appointment_id: 'non-existing',
        description: 'cerveja',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
