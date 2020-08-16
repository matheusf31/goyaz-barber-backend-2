import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateAppointmentAdditionalsQuantityService from '@modules/appointments/services/UpdateAppointmentAdditionalsQuantityService';

export default class AdditionalsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;
    const { description, amount } = request.body;

    const parsedAmount = Number(amount);

    const updateAppointmentAdditionalsQuantity = container.resolve(
      UpdateAppointmentAdditionalsQuantityService,
    );

    const appointment = await updateAppointmentAdditionalsQuantity.execute({
      appointment_id,
      description: String(description),
      amount: parsedAmount,
    });

    delete appointment.canceled_at;
    delete appointment.updated_at;

    return response.json(appointment);
  }
}
