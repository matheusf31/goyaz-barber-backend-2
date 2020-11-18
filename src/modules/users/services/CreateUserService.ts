import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  provider?: boolean;
  admin?: boolean;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cashProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    email,
    phone,
    provider,
    password,
    admin,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists && provider === false) {
      throw new AppError('Esse email já está em uso.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      provider,
      admin,
    });

    if (user.provider) {
      await this.cashProvider.invalidatePrefix('providers-list');
    }

    return user;
  }
}

export default CreateUserService;
