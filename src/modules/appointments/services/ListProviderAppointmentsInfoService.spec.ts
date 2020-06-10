// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsInfoService from './ListProviderAppointmentsInfoService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsInfo: ListProviderAppointmentsInfoService;

describe('ListProviderAppointmentsInfo', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointmentsInfo = new ListProviderAppointmentsInfoService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list users schedules', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'one-id',
      date: new Date(2020, 4, 5, 14, 0, 0),
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
      date: new Date(2020, 4, 25, 14, 30, 0),
      user_id: 'logged-user',
      service: 'corte',
      price: 35,
    });

    appointment2.concluded = true;
    appointment3.concluded = true;

    const appointmentsInfo = await listProviderAppointmentsInfo.execute({
      provider_id: 'one-id',
      month: 5,
      year: 2020,
    });

    expect(appointmentsInfo).toHaveProperty('weekInfo');
  });
});
