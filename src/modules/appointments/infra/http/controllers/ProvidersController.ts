import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import DeleteProviderService from '@modules/appointments/services/DeleteProviderService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      user_id,
    });

    return response.json(classToClass(providers));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const logged_provider = request.user.id;
    const { provider_id } = request.params;

    const deleteProvider = container.resolve(DeleteProviderService);

    await deleteProvider.execute({ logged_provider, provider_id });

    return response.status(204).json();
  }
}
