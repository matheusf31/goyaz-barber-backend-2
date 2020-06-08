// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListAppointmentsUserService from './ListAppointmentsUserService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listAppointmentsUserService: ListAppointmentsUserService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listAppointmentsUserService = new ListAppointmentsUserService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments by provider', async () => {
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

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 11).getTime();
    });

    const appointments = await listAppointmentsUserService.execute({
      user_id: 'logged-user',
      year: 2020,
      month: 5,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
