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
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year },
    );

    const appointmentsInfo = {} as IAppointmentsInfo;

    appointmentsInfo.weekInfo = [];

    const concludedAppointmentsInMonth = appointments.filter(
      appointment => appointment.concluded === true,
    );

    for (let week = 1; week <= 5; week++) {
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
      ] as IWeekServices;

      const profitWithoutAdditionals = concludedAppointmentsInMonth.reduce(
        (accumulator, appointment) =>
          getWeekOfMonth(appointment.date, {
            locale: pt,
          }) === week
            ? accumulator + Number(appointment.price)
            : accumulator,
        0,
      );

      const profitWithAdditionals = concludedAppointmentsInMonth.reduce(
        (accumulator, appointment) => {
          if (
            getWeekOfMonth(appointment.date, {
              locale: pt,
            }) === week
          ) {
            return (
              accumulator +
              Number(appointment.price) +
              Number(appointment.additionals.total_income)
            );
          }

          return accumulator;
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
      (accumulator, week) => accumulator + week.profitWithoutAdditionals,
      0,
    );

    const totalProfitInMonthWithAdditionals = appointmentsInfo.weekInfo.reduce(
      (accumulator, week) => accumulator + week.profitWithAdditionals,
      0,
    );

    const totalCustomersInMonth = appointmentsInfo.weekInfo.reduce(
      (accumulator, week) => accumulator + week.customers,
      0,
    );

    appointmentsInfo.totalAppointmentsInMonth = appointments.length;
    appointmentsInfo.concludedAppointmentsInMonth =
      concludedAppointmentsInMonth.length;
    appointmentsInfo.totalProfitInMonthWithoutAdditionals = totalProfitInMonthWithoutAdditionals;
    appointmentsInfo.totalProfitInMonthWithAdditionals = totalProfitInMonthWithAdditionals;
    appointmentsInfo.totalCustomersInMonth = totalCustomersInMonth;

    return appointmentsInfo;
  }
}

export default ListProviderAppointmentsInfoService;
