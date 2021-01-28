import { injectable, inject } from 'tsyringe';
import { getWeekOfMonth } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import IAppointmentsInfo, { IWeekServices } from '../dtos/IAppointmentsInfoDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsInfoService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IAppointmentsInfo> {
    const allProvidersAppointments = await this.appointmentsRepository.findAllInMonth(
      {
        month,
        year,
      },
    );

    const oneProviderAppointments = allProvidersAppointments.filter(
      appointment => appointment.provider_id === provider_id,
    );

    const allProvidersConcludedAppointmentsInMonth = allProvidersAppointments.filter(
      appointment => appointment.concluded === true,
    );

    const concludedAppointmentsInMonth = oneProviderAppointments.filter(
      appointment => appointment.concluded === true,
    );

    const appointmentsInfo = {} as IAppointmentsInfo;

    appointmentsInfo.weekInfo = [];

    for (let week = 1; week <= 6; week++) {
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
          description: 'pezinho',
          quantity: 0,
        },
        {
          description: 'corte militar',
          quantity: 0,
        },
        {
          description: 'corte e hot towel',
          quantity: 0,
        },
      ] as IWeekServices;

      const profitWithoutAdditionals = concludedAppointmentsInMonth.reduce(
        (total, appointment) =>
          getWeekOfMonth(appointment.date, {
            locale: pt,
          }) === week
            ? total + Number(appointment.price)
            : total,
        0,
      );

      const profitWithAdditionals = concludedAppointmentsInMonth.reduce(
        (total, appointment) => {
          if (
            getWeekOfMonth(appointment.date, {
              locale: pt,
            }) === week
          ) {
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

      const customers = concludedAppointmentsInMonth.filter(
        appointment =>
          getWeekOfMonth(appointment.date, {
            locale: pt,
          }) === week,
      ).length;

      concludedAppointmentsInMonth.forEach(appointment => {
        if (
          getWeekOfMonth(appointment.date, {
            locale: pt,
          }) === week
        ) {
          const findIndex = services.findIndex(
            service => service.description === appointment.service,
          );

          services[findIndex].quantity += 1;
        }
      });

      appointmentsInfo.weekInfo.push({
        profitWithoutAdditionals,
        profitWithAdditionals,
        customers,
        services,
      });
    }

    const totalProfitInMonthWithoutAdditionals = appointmentsInfo.weekInfo.reduce(
      (total, week) => total + week.profitWithoutAdditionals,
      0,
    );

    const totalProfitInMonthWithAdditionals = appointmentsInfo.weekInfo.reduce(
      (total, week) => total + week.profitWithAdditionals,
      0,
    );

    const totalCustomersInMonth = appointmentsInfo.weekInfo.reduce(
      (total, week) => total + week.customers,
      0,
    );

    const totalBarberProfit = allProvidersConcludedAppointmentsInMonth.reduce(
      (total, appointment) =>
        total +
        Number(appointment.price) +
        Number(appointment.additionals.total_income),
      0,
    );

    appointmentsInfo.totalAppointmentsInMonth = oneProviderAppointments.length;
    appointmentsInfo.concludedAppointmentsInMonth =
      concludedAppointmentsInMonth.length;
    appointmentsInfo.totalProfitInMonthWithoutAdditionals = totalProfitInMonthWithoutAdditionals;
    appointmentsInfo.totalProfitInMonthWithAdditionals = totalProfitInMonthWithAdditionals;
    appointmentsInfo.totalCustomersInMonth = totalCustomersInMonth;
    appointmentsInfo.totalBarberProfit = totalBarberProfit;

    return appointmentsInfo;
  }
}

export default ListProviderAppointmentsInfoService;
