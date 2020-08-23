import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ListUsersService from './ListUsersService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listUsers: ListUsersService;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    listUsers = new ListUsersService(
      fakeUsersRepository,
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all users where provider false', async () => {
    const provider = await createUser.execute({
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

    Object.assign(user2, { avatar_url: null, concludedAppointments: 0 });

    delete user2.password;

    const user3 = await createUser.execute({
      name: 'John',
      email: 'johnthree@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: false,
    });

    Object.assign(user3, { avatar_url: null, concludedAppointments: 0 });

    delete user3.password;

    const users = await listUsers.execute({ provider_id: provider.id });

    expect(users).toEqual([user2, user3]);
  });
});
