import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CancelAppointmentService from '@modules/appointments/services/CancelAppointmentService';

export default class CancelAppointmentController {
  public async update(request: Request, response: Response): Promise<Response> {
    const logged_user_id = request.user.id;
    const { appointment_id } = request.params;

    const cancelAppointment = container.resolve(CancelAppointmentService);

    const appointment = await cancelAppointment.execute({
      appointment_id,
      logged_user_id,
    });

    return response.json(appointment);
  }
}
