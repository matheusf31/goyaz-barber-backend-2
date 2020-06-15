import IAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllUserAppointmentsInMonthDTO from '../dtos/IFindAllUserAppointmentsInMonthDTO';

import Appointment from '../infra/typeorm/entities/Appointment';

export default interface AppointmentsRepository {
  create(data: IAppointmentDTO): Promise<Appointment>;
  save(appointment: Appointment): Promise<Appointment>;
  delete(appointment_id: string): Promise<void>;
  findById(appointment_id: string): Promise<Appointment | undefined>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findLessThanWeek(user_id: string): Promise<Appointment | undefined>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllUserAppointmentsInMonth(
    data: IFindAllUserAppointmentsInMonthDTO,
  ): Promise<Appointment[]>;
}
