import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  provider_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ provider_id }: IRequest): Promise<void> {
    const provider = await this.usersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError('Usuário não existe.');
    }

    await this.usersRepository.delete(provider_id);
  }
}

export default ShowProfileService;
