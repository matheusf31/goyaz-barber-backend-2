import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsDailyInfoService from '@modules/appointments/services/ListProviderAppointmentsDailyInfoService';

export default class AppointmentsDailyInfoController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const listProviderAppointmentsDailyInfo = container.resolve(
      ListProviderAppointmentsDailyInfoService,
    );

    const appointmentsInfo = await listProviderAppointmentsDailyInfo.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(appointmentsInfo);
  }
}
