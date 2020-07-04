import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateAppointmentAdditionalsService from '@modules/appointments/services/UpdateAppointmentAdditionalsService';
import DeleteAppointmentAdditionalsService from '@modules/appointments/services/DeleteAppointmentAdditionalsService';

export default class AdditionalController {
  public async update(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { appointment_id, additional } = request.body;

    const updateAppointmentAdditionals = container.resolve(
      UpdateAppointmentAdditionalsService,
    );

    const appointment = await updateAppointmentAdditionals.execute({
      provider_id,
      appointment_id,
      additional,
    });

    delete appointment.canceled_at;
    delete appointment.updated_at;

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;
    const { description } = request.query;

    const deleteAppointmentAdditionals = container.resolve(
      DeleteAppointmentAdditionalsService,
    );

    const appointment = await deleteAppointmentAdditionals.execute({
      appointment_id,
      description: String(description),
    });

    delete appointment.canceled_at;
    delete appointment.updated_at;

    return response.json(appointment);
  }
}
