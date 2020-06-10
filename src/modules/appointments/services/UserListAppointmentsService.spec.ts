// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import UserListAppointmentsService from './UserListAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let userListAppointmentsService: UserListAppointmentsService;

describe('UserListAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    userListAppointmentsService = new UserListAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list users schedules', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 19, 14, 0, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 25,
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 19, 14, 30, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 25,
    });

    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 17, 14, 30, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 25,
    });

    appointment3.concluded = true;
    appointment3.additionals.services = JSON.stringify([
      {
        description: 'corte',
        price: 25,
      },
    ]);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 9, 0, 0).getTime();
    });

    const appointments = await userListAppointmentsService.execute({
      user_id: 'logged-user',
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2, appointment3]);
  });
});
