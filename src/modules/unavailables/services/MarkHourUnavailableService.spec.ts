import FakeUnavailablesRepository from '../repositories/fakes/FakeUnavailablesRepository';
import MarkHourUnavailableService from './MarkHourUnavailableService';

let fakeUnavailablesRepository: FakeUnavailablesRepository;
let markHourUnavailable: MarkHourUnavailableService;

describe('MarkHourUnavailable', () => {
  beforeEach(() => {
    fakeUnavailablesRepository = new FakeUnavailablesRepository();

    markHourUnavailable = new MarkHourUnavailableService(
      fakeUnavailablesRepository,
    );
  });

  it('should be able to mark a hour as unavailable', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 9, 8).getTime();
    });

    const availability = await markHourUnavailable.execute({
      date: new Date(2020, 4, 9, 15),
      provider_id: '123123',
      is_unavailable: true,
    });

    expect(availability).toHaveProperty('id');
    expect(availability.provider_id).toBe('123123');
    expect(availability.is_unavailable).toBe(true);
  });

  it('should not be able to mark an hour unavailable at the same time as another', async () => {
    const date = new Date(2020, 4, 11, 16);

    await markHourUnavailable.execute({
      date,
      provider_id: '123123',
      is_unavailable: false,
    });

    const availability = await markHourUnavailable.execute({
      date,
      provider_id: '123123',
      is_unavailable: true,
    });

    const availability2 = await markHourUnavailable.execute({
      date: new Date(2020, 4, 11, 17),
      provider_id: '123123',
      is_unavailable: false,
    });

    expect(availability.is_unavailable).toBe(true);
    expect(availability2.is_unavailable).toBe(false);
  });
});
