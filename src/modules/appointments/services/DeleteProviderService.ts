import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  provider_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cashProvider: ICacheProvider,
  ) {}

  public async execute({ provider_id }: IRequest): Promise<void> {
    const provider = await this.usersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError('Usuário não existe.');
    }

    // fazer as duas ao mesmo tempo
    await this.usersRepository.delete(provider_id);

    await this.cashProvider.invalidatePrefix('providers-list');
  }
}

export default ShowProfileService;
