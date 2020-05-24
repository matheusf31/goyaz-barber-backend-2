import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface IRequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentRepository;

  constructor(appointmentsRepository: AppointmentRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: IRequestDTO): Appointment {
    const appointmentDate = startOfHour(date); // allowed times: 8:00, 9:00, 10:00... (regra de negócio)

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('Esse horário já está ocupado.');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
