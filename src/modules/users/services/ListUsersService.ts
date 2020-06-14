import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<User[]> {
    // const cacheData = await this.cacheProvider.recover('asd');

    const users = await this.usersRepository.findAllUsers();

    // await this.cacheProvider.save('asd', 'asd');

    return users;
  }
}

export default ListUsersService;
