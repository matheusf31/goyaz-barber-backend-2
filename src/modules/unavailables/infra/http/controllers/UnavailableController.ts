import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import { container } from 'tsyringe';

import MarkHourUnavailableService from '@modules/unavailables/services/MarkHourUnavailableService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { date, is_unavailable } = request.body;

    const parsedDate = parseISO(date);

    const markHourUnavailable = container.resolve(MarkHourUnavailableService);

    const availability = await markHourUnavailable.execute({
      provider_id,
      date: parsedDate,
      is_unavailable,
    });

    return response.json(availability);
  }
}
