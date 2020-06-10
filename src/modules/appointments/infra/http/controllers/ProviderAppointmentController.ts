import { Request, Response } from 'express';

import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ProviderCreateAppointmentService from '@modules/appointments/services/ProviderCreateAppointmentService';
import ProviderDeleteAppointmentService from '@modules/appointments/services/ProviderDeleteAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { user_id, date, service, foreign_client_name } = request.body;

    const parsedDate = parseISO(date);

    const providerCreateAppointment = container.resolve(
      ProviderCreateAppointmentService,
    );

    const appointment = await providerCreateAppointment.execute({
      provider_id,
      user_id,
      service,
      date: parsedDate,
      foreign_client_name,
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
