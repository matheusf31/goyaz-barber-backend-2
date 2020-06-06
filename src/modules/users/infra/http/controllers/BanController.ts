import { Request, Response } from 'express';
import { container } from 'tsyringe';

import BanUserService from '@modules/users/services/BanUserService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id, banned } = request.body;

    const banUser = container.resolve(BanUserService);

    const user = await banUser.execute({ user_id, banned });

    delete user.password;

    return response.json(user);
  }
}
