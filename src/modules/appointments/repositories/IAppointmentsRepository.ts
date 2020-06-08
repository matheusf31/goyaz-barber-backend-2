import IAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
import IFindAllUserAppointmentsInMonthDTO from '../dtos/IFindAllUserAppointmentsInMonthDTO';

import Appointment from '../infra/typeorm/entities/Appointment';

export default interface AppointmentsRepository {
  create(data: IAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllUserAppointmentsInMonth(
    data: IFindAllUserAppointmentsInMonthDTO,
  ): Promise<Appointment[]>;
  findById(appointment_id: string): Promise<Appointment | undefined>;
  save(appointment: Appointment): Promise<Appointment>;
}
