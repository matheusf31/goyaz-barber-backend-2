import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute({ provider_id });

    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, phone, password, provider } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      phone,
      password,
      provider,
    });

    return response.json(classToClass(user));
  }
}
