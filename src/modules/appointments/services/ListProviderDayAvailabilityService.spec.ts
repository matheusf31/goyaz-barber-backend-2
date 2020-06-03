// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  /**
   * [ ] fazer verificação se o usuário existe na hora de fazer um agendamento
   * [ ] testar se domingo todos os horários estão indisponíveis (it should be list sunday unavailable)
   */

  it('should be able to list the day availability from provider', async () => {
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
      date: new Date(2020, 4, 19, 15, 0, 0),
      user_id: 'logged-user',
      service: 'corte e barba',
      price: 35,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'one-id',
      year: 2020,
      month: 5,
      day: 19,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          hour: 9,
          minute: 0,
          available: false,
        },
        {
          hour: 10,
          minute: 30,
          available: false,
        },
        {
          hour: 11,
          minute: 30,
          available: true,
        },
        {
          hour: 13,
          minute: 30,
          available: true,
        },
        {
          hour: 14,
          minute: 0,
          available: false,
          appointment: appointment1,
        },
        {
          hour: 14,
          minute: 30,
          available: false,
          appointment: appointment2,
        },
        {
          hour: 15,
          minute: 0,
          available: false,
          appointment: appointment3,
        },
        {
          hour: 15,
          minute: 30,
          available: false,
        },
        {
          hour: 16,
          minute: 0,
          available: true,
        },
        {
          hour: 19,
          minute: 0,
          available: true,
        },
      ]),
    );
  });

  it('should be able to list the day availability from provider in sunday', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 25,
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 20, 16, 0, 0),
      user_id: 'logged-user',
      service: 'hot towel',
      price: 35,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availabilityInSaturday = await listProviderDayAvailability.execute({
      provider_id: 'one-id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availabilityInSaturday).toEqual(
      expect.arrayContaining([
        {
          hour: 10,
          minute: 30,
          available: false,
        },
        {
          hour: 14,
          minute: 0,
          available: false,
          appointment: appointment1,
        },
        {
          hour: 16,
          minute: 0,
          available: false,
          appointment: appointment2,
        },
        {
          hour: 16,
          minute: 30,
          available: false,
        },
        {
          hour: 17,
          minute: 0,
          available: true,
        },
      ]),
    );
  });
});
