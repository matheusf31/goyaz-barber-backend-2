import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ConcludeAppointmentService from '@modules/appointments/services/ConcludeAppointmentService';

export default class CancelAppointmentController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;
    const { concluded } = request.body;

    const concludeAppointment = container.resolve(ConcludeAppointmentService);

    const appointment = await concludeAppointment.execute({
      appointment_id,
      concluded,
    });

    return response.json(appointment);
  }
}
