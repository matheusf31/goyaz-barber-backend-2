import { endOfDay } from 'date-fns';
// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeUnavailablesRepository from '@modules/unavailables/repositories/fakes/FakeUnavailablesRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUnavailablesRepository: FakeUnavailablesRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUnavailablesRepository = new FakeUnavailablesRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
      fakeUnavailablesRepository,
    );
  });

  /**
   * [ ] fazer verificação se o usuário existe na hora de fazer um agendamento
   * [ ] testar se domingo todos os horários estão indisponíveis (it should be list sunday unavailable)
   * [ ] arrumar testes quebrados
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

    await fakeUnavailablesRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 19, 16, 0, 0),
      is_unavailable: true,
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
          time: '09:00',
          timeFormatted: '2020-05-19T09:00:00-03:00',
          available: false,
          past: true,
        },
        {
          time: '10:30',
          timeFormatted: '2020-05-19T10:30:00-03:00',
          available: false,
          past: true,
        },
        {
          time: '11:30',
          timeFormatted: '2020-05-19T11:30:00-03:00',
          available: true,
          past: false,
        },
        {
          time: '13:30',
          timeFormatted: '2020-05-19T13:30:00-03:00',
          available: true,
          past: false,
        },
        {
          time: '14:00',
          timeFormatted: '2020-05-19T14:00:00-03:00',
          available: false,
          appointment: appointment1,
          past: false,
        },
        {
          time: '14:30',
          timeFormatted: '2020-05-19T14:30:00-03:00',
          available: false,
          appointment: appointment2,
          past: false,
        },
        {
          time: '15:00',
          timeFormatted: '2020-05-19T15:00:00-03:00',
          available: false,
          appointment: appointment3,
          past: false,
        },
        {
          time: '15:30',
          timeFormatted: '2020-05-19T15:30:00-03:00',
          available: false,
          past: false,
        },
        {
          time: '16:00',
          timeFormatted: '2020-05-19T16:00:00-03:00',
          available: false,
          past: false,
          providerBusy: true,
        },
        {
          time: '19:00',
          timeFormatted: '2020-05-19T19:00:00-03:00',
          available: true,
          past: false,
        },
      ]),
    );
  });

  it('should be able to list the day availability from provider in saturday', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 5, 20, 14, 0, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 25,
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 5, 20, 16, 0, 0),
      user_id: 'logged-user',
      service: 'hot towel',
      price: 35,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 9).getTime();
    });

    const availabilityInSaturday = await listProviderDayAvailability.execute({
      provider_id: 'one-id',
      year: 2020,
      month: 6,
      day: 20,
    });

    expect(availabilityInSaturday).toEqual(
      expect.arrayContaining([
        {
          time: '10:30',
          timeFormatted: '2020-06-20T10:30:00-03:00',
          available: true,
          past: false,
        },
        {
          time: '14:00',
          timeFormatted: '2020-06-20T14:00:00-03:00',
          available: false,
          appointment: appointment1,
          past: false,
        },
        {
          time: '16:00',
          timeFormatted: '2020-06-20T16:00:00-03:00',
          available: false,
          appointment: appointment2,
          past: false,
        },
        {
          time: '16:30',
          timeFormatted: '2020-06-20T16:30:00-03:00',
          available: true,
          past: false,
        },
        {
          time: '17:00',
          timeFormatted: '2020-06-20T17:00:00-03:00',
          available: true,
          past: false,
        },
      ]),
    );
  });

  it('should be able to list all day unavailable', async () => {
    await fakeUnavailablesRepository.create({
      provider_id: 'one-id',
      date: endOfDay(new Date(2020, 4, 19)),
      is_unavailable: true,
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
          time: '09:00',
          timeFormatted: '2020-05-19T09:00:00-03:00',
          available: false,
          past: true,
        },
        {
          time: '10:30',
          timeFormatted: '2020-05-19T10:30:00-03:00',
          available: false,
          past: true,
        },
        {
          time: '11:30',
          timeFormatted: '2020-05-19T11:30:00-03:00',
          available: false,
          past: false,
        },
        {
          time: '13:30',
          timeFormatted: '2020-05-19T13:30:00-03:00',
          available: false,
          past: false,
        },
        {
          time: '14:00',
          timeFormatted: '2020-05-19T14:00:00-03:00',
          available: false,
          past: false,
        },
      ]),
    );
  });
});
