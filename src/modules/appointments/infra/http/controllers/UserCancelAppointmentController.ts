import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UserCancelAppointmentService from '@modules/appointments/services/UserCancelAppointmentService';

export default class UserCancelAppointmentController {
  public async update(request: Request, response: Response): Promise<Response> {
    const logged_user_id = request.user.id;
    const { appointment_id } = request.params;

    const userCancelAppointment = container.resolve(
      UserCancelAppointmentService,
    );

    const appointment = await userCancelAppointment.execute({
      logged_user_id,
      appointment_id,
    });

    return response.json(appointment);
  }
}
