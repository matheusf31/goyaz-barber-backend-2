// import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users where provider false', async () => {
    await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
    });

    const user2 = await createUser.execute({
      name: 'John',
      email: 'johndoe@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: false,
    });

    const user3 = await createUser.execute({
      name: 'John',
      email: 'johnthree@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: false,
    });

    const users = await listUsers.execute();

    expect(users).toEqual([user2, user3]);
  });
});
