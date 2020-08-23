import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  logged_provider: string;
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

  public async execute({
    logged_provider,
    provider_id,
  }: IRequest): Promise<void> {
    const provider = await this.usersRepository.findById(provider_id);
    const loggedProvider = await this.usersRepository.findById(logged_provider);

    if (!loggedProvider || !loggedProvider.admin) {
      throw new AppError(
        'Você não tem permissão para deletar um prestador de serviços.',
        401,
      );
    }

    if (!provider) {
      throw new AppError('Usuário não existe.');
    }

    await Promise.all([
      this.usersRepository.delete(provider_id),
      this.cashProvider.invalidatePrefix('providers-list'),
    ]);
  }
}

export default ShowProfileService;
