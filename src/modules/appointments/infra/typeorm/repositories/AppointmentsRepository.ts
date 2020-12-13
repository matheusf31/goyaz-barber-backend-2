import { getRepository, Repository, Between, MoreThan } from 'typeorm';
import { endOfDay, endOfMonth, format } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllUserAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindAllUserAppointmentsInMonthDTO';

import Appointment from '../entities/Appointment';
import Additional from '../entities/Additional';

const MoreThanDate = (date: Date) =>
  MoreThan(format(date, "yyyy-MM-dd'T'HH:mm:ssxxx"));

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllByProviderId(
    provider_id: string,
  ): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        canceled_at: null,
        concluded: true,
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const searchDate = new Date(year, month - 1, day);

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        canceled_at: null,
        date: Between(searchDate, endOfDay(searchDate)),
      },
      select: [
        'id',
        'concluded',
        'date',
        'foreign_client_name',
        'service',
        'price',
        'canceled_at',
        'user_id',
      ],
      relations: ['additionals', 'user'],
    });

    return appointments;
  }

  public async findAllInMonth({
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const searchDate = new Date(year, month - 1);

    const appointments = await this.ormRepository.find({
      where: {
        date: Between(searchDate, endOfMonth(searchDate)),
      },
      select: [
        'id',
        'provider_id',
        'concluded',
        'date',
        'foreign_client_name',
        'service',
        'price',
        'canceled_at',
      ],
      relations: ['additionals', 'provider'],
    });

    return appointments;
  }

  public async findAllConcludedInMonth({
    provider_id,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const searchDate = new Date(year, month - 1);

    const appointments = await this.ormRepository.find({
      where: {
        date: Between(searchDate, endOfMonth(searchDate)),
        provider_id,
        concluded: true,
        canceled_at: null,
      },
      select: [
        'id',
        'provider_id',
        'concluded',
        'date',
        'foreign_client_name',
        'service',
        'price',
        'canceled_at',
      ],
      relations: ['additionals', 'provider'],
    });

    return appointments;
  }

  public async findAllUserAppointmentsInMonth({
    user_id,
    month,
    year,
  }: IFindAllUserAppointmentsInMonthDTO): Promise<Appointment[]> {
    const searchDate = new Date(year, month - 1);

    const appointments = await this.ormRepository.find({
      where: {
        user_id,
        canceled_at: null,
        date: Between(searchDate, endOfMonth(searchDate)),
      },
      select: [
        'id',
        'concluded',
        'date',
        'foreign_client_name',
        'service',
        'price',
        'canceled_at',
        'user_id',
      ],
      relations: ['additionals', 'provider'],
      order: {
        date: 'ASC',
      },
    });

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id,
        canceled_at: null,
      },
    });

    return findAppointment;
  }

  public async findExistentUserAppointment(
    user_id: string,
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: {
        user_id,
        canceled_at: null,
        concluded: false,
        date: MoreThanDate(new Date()),
      },
      select: ['id', 'concluded', 'canceled_at', 'user_id', 'date'],
      relations: ['user'],
    });

    return appointment;
  }

  public async findById(
    appointment_id: string,
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne(appointment_id, {
      relations: ['additionals', 'user'],
    });

    return appointment;
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    return this.ormRepository.save(appointment);
  }

  public async create({
    user_id,
    provider_id,
    service,
    price,
    date,
    foreign_client_name,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
      service,
      price,
      foreign_client_name,
    });

    const additional = new Additional();

    additional.appointment_id = appointment.id;
    additional.services = JSON.stringify([]);
    additional.total_income = 0;

    appointment.additionals = additional;

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async delete(appointment_id: string): Promise<void> {
    this.ormRepository.delete(appointment_id);
  }
}

export default AppointmentsRepository;
