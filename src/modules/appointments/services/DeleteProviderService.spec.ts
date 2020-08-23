import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
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

    deleteProviderService = new DeleteProviderService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a provider', async () => {
    const provider = await createUser.execute({
      name: 'John',
      email: 'johndoe@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
      admin: true,
    });

    const logged_provider = await createUser.execute({
      name: 'John2',
      email: 'johntre@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
      admin: true,
    });

    await deleteProviderService.execute({
      logged_provider: logged_provider.id,
      provider_id: provider.id,
    });
  });

  it('should not be able to delete a non existing provider', async () => {
    const logged_provider = await createUser.execute({
      name: 'John',
      email: 'johntre@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
      admin: true,
    });

    await expect(
      deleteProviderService.execute({
        logged_provider: logged_provider.id,
        provider_id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a provider with non admin provider', async () => {
    const provider = await createUser.execute({
      name: 'John',
      email: 'johndoe@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
      admin: true,
    });

    const logged_provider = await createUser.execute({
      name: 'John2',
      email: 'johntre@gmail.com',
      phone: '994622353',
      password: '123123',
      provider: true,
      admin: false,
    });

    await expect(
      deleteProviderService.execute({
        logged_provider: logged_provider.id,
        provider_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
