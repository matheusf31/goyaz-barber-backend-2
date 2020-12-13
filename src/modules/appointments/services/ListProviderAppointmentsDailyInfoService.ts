import { injectable, inject } from 'tsyringe';
import { getDay, getWeekOfMonth } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import {
  IAppointmentExtraDailyInfo,
  IDayOfWeekInfo,
  IWeekInfo,
  IServices,
} from '../dtos/IAppointmentsDailyInfoDTO';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

const daysOfTheWeek = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
} as { [key: number]: string };

@injectable()
class ListProviderAppointmentsDailyInfoService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IAppointmentExtraDailyInfo> {
    const allConcludedAppointmentsByProvider = await this.appointmentsRepository.findAllConcludedInMonth(
      {
        provider_id,
        month,
        year,
      },
    );

    const data = {} as IAppointmentExtraDailyInfo;
    let totalProfitInMonthWithoutAdditionals = 0;
    let totalProfitInMonthWithAdditionals = 0;
    let totalClientsInMonth = 0;

    function isSameWeekAndDay(
      date: Date,
      compareWeek: number,
      compareDay: number,
    ) {
      return (
        getWeekOfMonth(date, {
          locale: pt,
        }) === compareWeek && getDay(date) === compareDay
      );
    }

    function isSameWeek(date: Date, compareWeek: number) {
      return (
        getWeekOfMonth(date, {
          locale: pt,
        }) === compareWeek
      );
    }

    for (let week = 1; week <= 6; week++) {
      const weekName = `week${week}`;

      data[weekName] = {} as IWeekInfo;

      for (let dayOfWeek = 1; dayOfWeek <= 6; dayOfWeek++) {
        data[weekName][daysOfTheWeek[dayOfWeek]] = {} as IDayOfWeekInfo;
        data[weekName][daysOfTheWeek[dayOfWeek]].clients = 0;

        allConcludedAppointmentsByProvider.forEach(appointment => {
          if (isSameWeekAndDay(appointment.date, week, dayOfWeek)) {
            const services = [
              {
                description: 'corte',
                quantity: 0,
              },
              {
                description: 'corte e barba',
                quantity: 0,
              },
              {
                description: 'barba',
                quantity: 0,
              },
              {
                description: 'hot towel',
                quantity: 0,
              },
              {
                description: 'corte e hot towel',
                quantity: 0,
              },
            ] as IServices;

            const serviceIndex = services.findIndex(
              service => service.description === appointment.service,
            );

            services[serviceIndex].quantity += 1;

            data[weekName][daysOfTheWeek[dayOfWeek]].date = appointment.date;
            data[weekName][daysOfTheWeek[dayOfWeek]].clients += 1;
            data[weekName][daysOfTheWeek[dayOfWeek]].services = services;
          }
        });

        totalClientsInMonth += data[weekName][daysOfTheWeek[dayOfWeek]].clients;
      }

      const profitWithoutAdditionals = allConcludedAppointmentsByProvider.reduce(
        (total, appointment) =>
          isSameWeek(appointment.date, week)
            ? total + Number(appointment.price)
            : total,
        0,
      );

      const profitWithAdditionals = allConcludedAppointmentsByProvider.reduce(
        (total, appointment) => {
          if (isSameWeek(appointment.date, week)) {
            return (
              total +
              Number(appointment.price) +
              Number(appointment.additionals.total_income)
            );
          }

          return total;
        },
        0,
      );

      data[weekName].profitWithoutAdditionals = profitWithoutAdditionals;
      data[weekName].profitWithAdditionals = profitWithAdditionals;

      totalProfitInMonthWithoutAdditionals += profitWithoutAdditionals;
      totalProfitInMonthWithAdditionals += profitWithAdditionals;
    }

    data.totalClientsInMonth = totalClientsInMonth;
    data.totalProfitInMonthWithoutAdditionals = totalProfitInMonthWithoutAdditionals;
    data.totalProfitInMonthWithAdditionals = totalProfitInMonthWithAdditionals;

    return data;
  }
}

export default ListProviderAppointmentsDailyInfoService;
