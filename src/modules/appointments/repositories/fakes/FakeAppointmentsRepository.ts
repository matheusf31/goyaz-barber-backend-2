// import { uuid } from 'uuidv4';

// import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

// import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

// class AppointmentsRepository implements IAppointmentRepository {
//   private appointments: Appointment[] = [];

//   public async findByDate(date: Date): Promise<Appointment | undefined> {}

//   public async create({
//     provider_id,
//     date,
//   }: ICreateAppointmentDTO): Promise<Appointment> {
//     const appointment = new Appointment();

//     Object.assign(appointment)

//     appointment.id = uuid();
//     appointment.provider_id = provider_id;
//     appointment.date = date;

//     this.appointments.push(appointment);

//     return appointment;
//   }
// }

// export default AppointmentsRepository;
