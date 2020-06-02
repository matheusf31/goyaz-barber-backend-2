// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListAllProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John',
      email: 'one@gmail.com',
      password: '123456',
      provider: true,
    });

    await fakeUsersRepository.create({
      name: 'John',
      email: 'two@gmail.com',
      password: '123456',
      provider: false,
    });

    const user3 = await fakeUsersRepository.create({
      name: 'John',
      email: 'three@gmail.com',
      password: '123456',
      provider: true,
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'four@gmail.com',
      password: '123456',
      provider: true,
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user3]);
  });
});
