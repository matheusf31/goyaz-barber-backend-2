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
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Esse email já está em uso.');
    }

    // const reg = /^(62|062)(\d{4,5}-?\d{4})$/;
    // const reg2 = /-/;
    // let phoneFormatted = '';

    // if (!phone) {
    //   throw new AppError('Insira o número de telefone.');
    // }

    // const match = phone.match(reg);
    // const match2 = phone.match(reg2);

    // if (match2 && phone.length > 13) {
    //   throw new AppError('Número de telefone inválido');
    // }

    // if (!match2 && phone.length > 12) {
    //   throw new AppError('Número de telefone inválido');
    // }

    // if (!match) {
    //   throw new AppError('Número de telefone inválido');
    // }

    // // formatar o phone para salvar com hífen no banco de dados
    // if (match2) {
    //   phoneFormatted = phone;
    // } else {
    //   phoneFormatted = `${phone.substr(0, phone.length - 4)}-${phone.substr(
    //     phone.length - 4,
    //   )}`;
    // }

    // // formatar o phone para salvar com hífen no banco de dados
    // if (match2) {
    //   phoneFormatted = phone;
    // } else {
    //   phoneFormatted = `${phone.substr(0, phone.length - 4)}-${phone.substr(
    //     phone.length - 4,
    //   )}`;
    // }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      provider,
    });

    if (user.provider) {
      await this.cashProvider.invalidatePrefix('providers-list');
    }

    return user;
  }
}

export default CreateUserService;
