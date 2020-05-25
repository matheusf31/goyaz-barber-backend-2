import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    // Não precisa criar outro repositório se os métodos não serão sobrescritos
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Esse email já está em uso.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
