import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAppointmentsUserService from '@modules/appointments/services/ListAppointmentsUserService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { month, year } = request.body;

    const listAppointmentsUser = container.resolve(ListAppointmentsUserService);

    const appointments = await listAppointmentsUser.execute({
      user_id,
      month,
      year,
    });

    return response.json(appointments);
  }
}
