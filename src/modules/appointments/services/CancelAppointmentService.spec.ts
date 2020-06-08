import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import CancelAppointmentService from './CancelAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let cancelAppointment: CancelAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    cancelAppointment = new CancelAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to cancel a appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte',
    });

    await cancelAppointment.execute({
      appointment_id: appointment.id,
      logged_user_id: '123123',
    });

    expect(appointment.canceled_at.getTime()).toBe(
      new Date(2020, 4, 9, 10).getTime(),
    );
  });

  it('should not be able to cancel a non existing appointment', async () => {
    expect(
      cancelAppointment.execute({
        appointment_id: 'any',
        logged_user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to cancel a appointment from another user', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 10).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 13, 15),
      provider_id: '123123',
      user_id: 'logged-user',
      service: 'corte',
    });

    expect(
      cancelAppointment.execute({
        appointment_id: appointment.id,
        logged_user_id: 'another-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
