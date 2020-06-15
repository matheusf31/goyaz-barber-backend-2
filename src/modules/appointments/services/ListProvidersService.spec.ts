// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John',
      email: 'one@gmail.com',
      phone: '6299462353',
      password: '123456',
      provider: true,
    });

    await fakeUsersRepository.create({
      name: 'John',
      email: 'two@gmail.com',
      phone: '6299462353',
      password: '123456',
      provider: false,
    });

    const user3 = await fakeUsersRepository.create({
      name: 'John',
      email: 'three@gmail.com',
      phone: '6299462353',
      password: '123456',
      provider: true,
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'four@gmail.com',
      phone: '6299462353',
      password: '123456',
      provider: true,
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user3]);
  });
});
