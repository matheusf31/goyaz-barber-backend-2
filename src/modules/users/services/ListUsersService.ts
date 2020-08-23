import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
}

interface IResponse extends User {
  concludedAppointments: number;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
  }: IRequest): Promise<Omit<IResponse, 'getAvatarUrl'>[]> {
    let users = await this.usersRepository.findAllUsers();

    users = classToClass(users);

    const appointments = await this.appointmentsRepository.findAllByProviderId(
      provider_id,
    );

    const usersWithConcludedAppointments = users.map(user => {
      let concludedAppointments = 0;

      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].user_id === user.id && appointments[i].concluded) {
          concludedAppointments += 1;
        }
      }

      return {
        ...user,
        concludedAppointments,
      };
    });

    return usersWithConcludedAppointments;
  }
}

export default ListUsersService;
