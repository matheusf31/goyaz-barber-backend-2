import IUnavailableDTO from '@modules/unavailables/dtos/IUnavailableDTO';
import Unavailable from '@modules/unavailables/infra/typeorm/entities/Unavailable';
import IFindUnavailableByDateDTO from '../dtos/IFindUnavailableByDateDTO';
import IFindAllInDayUnavailableByDateDTO from '../dtos/IFindAllInDayUnavailableByDateDTO';

export default interface AppointmentsRepository {
  create(data: IUnavailableDTO): Promise<Unavailable>;
  save(Unavailable: Unavailable): Promise<Unavailable>;
  findUnavailableByDate(
    data: IFindUnavailableByDateDTO,
  ): Promise<Unavailable | undefined>;
  findAllInDayUnavailable(
    data: IFindAllInDayUnavailableByDateDTO,
  ): Promise<Unavailable[]>;
}
