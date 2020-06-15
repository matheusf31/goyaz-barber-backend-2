import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

@injectable()
class UserListAppointmentsService {
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

    /**
     * get just income appointments and concluded appointments
     */
    appointments = appointments.filter(
      appointment =>
        appointment.past === false || appointment.concluded === true,
    );

    return appointments;
  }
}

export default UserListAppointmentsService;
