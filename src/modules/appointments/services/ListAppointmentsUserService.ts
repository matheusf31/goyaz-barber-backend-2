import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

@injectable()
class ListAppointmentsUserService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    user_id,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllUserAppointmentsInMonth(
      { user_id, month, year },
    );

    // eslint-disable-next-line array-callback-return
    appointments.map(appointment => {
      // eslint-disable-next-line no-param-reassign
      appointment.additionals.services = JSON.parse(
        appointment.additionals.services,
      );
    });

    return appointments;
  }
}

export default ListAppointmentsUserService;
