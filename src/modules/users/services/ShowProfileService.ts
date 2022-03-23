import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    // const user = await this.usersRepository.findById(user_id);
    let user = await this.cacheProvider.recover<User>(`user:${user_id}`);

    if (!user) {
      user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('Usuário não existe.');
      }

      await this.cacheProvider.save(`user:${user_id}`, classToClass(user));
    }

    return user;
  }
}

export default ShowProfileService;
