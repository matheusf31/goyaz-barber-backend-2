// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    /**
     * [ ] fazer promisse all
     */

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 22, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'one-id',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 20,
          available: false,
        },
        {
          day: 21,
          available: true,
        },
        {
          day: 22,
          available: true,
        },
        {
          day: 23,
          available: true,
        },
      ]),
    );
  });
});

/**
 * [ ] fazer verificação se o usuário existe na hora de fazer um agendamento
 *
 */
