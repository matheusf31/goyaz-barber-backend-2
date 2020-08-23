import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate, isBefore } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllUserAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindAllUserAppointmentsInMonthDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findAllByProviderId(
    provider_id: string,
  ): Promise<Appointment[]> {
    const appointments = await this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        appointment.canceled_at === null &&
        appointment.concluded === true,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        appointment.canceled_at === null &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllUserAppointmentsInMonth({
    user_id,
    month,
    year,
  }: IFindAllUserAppointmentsInMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.user_id === user_id &&
        appointment.canceled_at === null &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async findExistentUserAppointment(
    user_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => {
      const compareDate = new Date(Date.now());

      return (
        !isBefore(appointment.date, compareDate) &&
        appointment.user_id === user_id &&
        appointment.concluded === false &&
        appointment.canceled_at === null
      );
    });

    return findAppointment;
  }

  public async findById(
    appointment_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => appointment.id === appointment_id,
    );

    if (
      findAppointment &&
      typeof findAppointment.additionals.services === 'object'
    ) {
      findAppointment.additionals.services = JSON.stringify(
        findAppointment?.additionals.services,
      );
    }

    return findAppointment;
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    const findIndex = this.appointments.findIndex(
      findAppointment => findAppointment.id === appointment.id,
    );

    this.appointments[findIndex] = appointment;

    return appointment;
  }

  public async create({
    user_id,
    provider_id,
    service,
    price,
    date,
    foreign_client_name,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id,
      service,
      price,
      foreign_client_name,
      canceled_at: null,
      concluded: false,
    });

    Object.assign(appointment, {
      additionals: {
        id: uuid(),
        appointment_id: appointment.id,
        total_income: 0,
        services: JSON.stringify([]),
      },
    });

    this.appointments.push(appointment);

    return appointment;
  }

  public async delete(appointment_id: string): Promise<void> {
    const findIndex = this.appointments.findIndex(
      appointment => appointment.id === appointment_id,
    );

    this.appointments.splice(findIndex, 1);
  }
}

export default FakeAppointmentsRepository;
