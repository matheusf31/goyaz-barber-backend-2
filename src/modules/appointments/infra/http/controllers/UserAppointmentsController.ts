import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { parseISO } from 'date-fns';

import UserListAppointmentsService from '@modules/appointments/services/UserListAppointmentsService';
import UserCancelAppointmentService from '@modules/appointments/services/UserCancelAppointmentService';
import UserCreateAppointmentService from '@modules/appointments/services/UserCreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date, service } = request.body;

    const parsedDate = parseISO(date);

    const userCreateAppointment = container.resolve(
      UserCreateAppointmentService,
    );

    const appointment = await userCreateAppointment.execute({
      provider_id,
      user_id,
      service,
      date: parsedDate,
    });

    return response.json(appointment);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { month, year } = request.body;

    const userListAppointments = container.resolve(UserListAppointmentsService);

    const appointments = await userListAppointments.execute({
      user_id,
      month,
      year,
    });

    return response.json(classToClass(appointments));
  }

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
