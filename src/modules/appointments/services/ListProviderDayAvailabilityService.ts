import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter, isSaturday, isSunday } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  minute: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    /**
     * Refatorar essa parte para o meu app
     * [x] colocar os minutos também (8:30)
     * [x] verificar se o hot towel é 1 hora (É 30 MIN)
     * [ ] verificar se o provider está com aquela hora marcada como OCUPADO
     *  - criar a tabela de horários ocupados
     * [ ] verificar se o dia foi marcado como indisponível
     *  - criar a tabela de horários ocupados
     */

    const schedule = [];

    if (isSaturday(new Date(year, month, day))) {
      schedule.push(
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
      );
    } else {
      schedule.push(
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
      );
    }

    const currentDate = new Date(Date.now());

    const availability = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const formatedHour = Number(hour);
      const formatedMinute = Number(minute);

      const hasAppointmentInHour = appointments.find(
        appointment =>
          getHours(appointment.date) === formatedHour &&
          getMinutes(appointment.date) === formatedMinute,
      );

      const hasHourlyServiceThirtyMinutesFromTheCurrentTime = appointments.find(
        appointment => {
          const pastHour =
            formatedMinute === 0 ? formatedHour - 1 : formatedHour;
          const pastMinute =
            formatedMinute === 0 ? formatedMinute + 30 : formatedMinute - 30;

          return (
            getHours(appointment.date) === pastHour &&
            getMinutes(appointment.date) === pastMinute &&
            (appointment.service === 'corte e barba' || 'corte e hot towel')
          );
        },
      );

      const compareDate = new Date(
        year,
        month - 1,
        day,
        formatedHour,
        formatedMinute,
      );

      return {
        hour: formatedHour,
        minute: formatedMinute,
        available:
          !hasAppointmentInHour &&
          isAfter(compareDate, currentDate) &&
          !isSunday(new Date(year, month, day)) &&
          !hasHourlyServiceThirtyMinutesFromTheCurrentTime,
        appointment: hasAppointmentInHour,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
