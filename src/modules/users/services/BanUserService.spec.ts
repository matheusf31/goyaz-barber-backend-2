import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import BanUserService from './BanUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let banUser: BanUserService;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('BanUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    banUser = new BanUserService(fakeUsersRepository);
  });

  it('should be able to ban a user', async () => {
    let user = await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
    });

    user = Object.assign(user, { banned: false });

    const bannedUser = await banUser.execute({
      user_id: user.id,
      banned: user.banned,
    });

    expect(bannedUser.banned).toBe(true);
  });

  it('should be able to unban a user', async () => {
    let user = await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
    });

    user = Object.assign(user, { banned: true });

    const bannedUser = await banUser.execute({
      user_id: user.id,
      banned: user.banned,
    });

    expect(bannedUser.banned).toBe(false);
  });

  it('should not be able to unban a non existing user', async () => {
    await expect(
      banUser.execute({
        user_id: 'non-existing-user',
        banned: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
