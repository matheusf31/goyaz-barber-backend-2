import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  banned: boolean;
}

@injectable()
class BanUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cashProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, banned }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Esse usuário não existe.');
    }

    user.banned = !banned;

    await this.cashProvider.invalidate(`user:${user_id}`);

    return this.usersRepository.save(user);
  }
}

export default BanUserService;
