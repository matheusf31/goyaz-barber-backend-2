import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  banned: boolean;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, banned }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Esse usuário não existe.');
    }

    user.banned = !banned;

    return this.usersRepository.save(user);
  }
}

export default ListUsersService;
