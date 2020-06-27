import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import DeleteProviderService from './DeleteProviderService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let deleteProviderService: DeleteProviderService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    deleteProviderService = new DeleteProviderService(fakeUsersRepository);
  });

  it('should be able to delete a provider', async () => {
    const user = await createUser.execute({
      name: 'John',
      email: 'johndoe@gmail.com',
      phone: '994622353',
      password: '123123',
    });

    await deleteProviderService.execute({ provider_id: user.id });
  });

  it('should not be able to delete a non existing provider', async () => {
    await expect(
      deleteProviderService.execute({ provider_id: 'non-existing-id ' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
