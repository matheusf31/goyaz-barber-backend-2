import { injectable, inject } from 'tsyringe';
import { isBefore } from 'date-fns';

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
    let appointments = await this.appointmentsRepository.findAllUserAppointmentsInMonth(
      { user_id, month, year },
    );

    const currentDate = new Date(Date.now());

    /**
     * set past variable to true or false
     */
    // eslint-disable-next-line array-callback-return
    appointments.map(appointment => {
      // eslint-disable-next-line no-param-reassign
      appointment.past = isBefore(appointment.date, currentDate);
    });

    /**
     * get just income appointments and concluded appointments
     */
    appointments = appointments.filter(
      appointment =>
        appointment.past === false || appointment.concluded === true,
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
