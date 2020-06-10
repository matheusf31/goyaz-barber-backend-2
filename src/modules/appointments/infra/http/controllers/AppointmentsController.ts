import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ProviderDeleteAppointmentService from '@modules/appointments/services/ProviderDeleteAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date, service } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      service,
      date: parsedDate,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;

    const providerDeleteAppointment = container.resolve(
      ProviderDeleteAppointmentService,
    );

    await providerDeleteAppointment.execute(appointment_id);

    return response.status(204).json();
  }
}
