import { getRepository, Repository, Raw } from 'typeorm';
// import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IUnavailablesRepository from '@modules/unavailables/repositories/IUnavailablesRepository';

import IUnavailableDTO from '@modules/unavailables/dtos/IUnavailableDTO';
import IFindUnavailableByDateDTO from '@modules/unavailables/dtos/IFindUnavailableByDateDTO';
import IFindAllInDayUnavailableByDateDTO from '@modules/unavailables/dtos/IFindAllInDayUnavailableByDateDTO';

import Unavailable from '@modules/unavailables/infra/typeorm/entities/Unavailable';

class UnavailablesRepository implements IUnavailablesRepository {
  private ormRepository: Repository<Unavailable>;

  constructor() {
    this.ormRepository = getRepository(Unavailable);
  }

  public async create({
    provider_id,
    date,
    is_unavailable,
  }: IUnavailableDTO): Promise<Unavailable> {
    const newUnavailable = this.ormRepository.create({
      provider_id,
      date,
      is_unavailable,
    });

    await this.ormRepository.save(newUnavailable);

    return newUnavailable;
  }

  public async save(unavailable: Unavailable): Promise<Unavailable> {
    return this.ormRepository.save(unavailable);
  }

  public async findUnavailableByDate({
    provider_id,
    date,
  }: IFindUnavailableByDateDTO): Promise<Unavailable | undefined> {
    const findUnavailable = await this.ormRepository.findOne({
      where: {
        provider_id,
        date,
      },
    });

    return findUnavailable;
  }

  public async findAllInDayUnavailable({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayUnavailableByDateDTO): Promise<Unavailable[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const unavailables = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFiealdName =>
            `to_char(${dateFiealdName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return unavailables;
  }
}

export default UnavailablesRepository;
