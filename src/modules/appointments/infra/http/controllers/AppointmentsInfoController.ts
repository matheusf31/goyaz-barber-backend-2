import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsInfoService from '@modules/appointments/services/ListProviderAppointmentsInfoService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id, month, year } = request.body;

    const listProviderAppointmentsInfo = container.resolve(
      ListProviderAppointmentsInfoService,
    );

    const appointmentsInfo = await listProviderAppointmentsInfo.execute({
      provider_id,
      month,
      year,
    });

    return response.json(appointmentsInfo);
  }
}
