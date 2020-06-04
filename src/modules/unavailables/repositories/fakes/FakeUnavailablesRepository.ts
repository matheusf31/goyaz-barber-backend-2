import { uuid } from 'uuidv4';
import { isEqual, getDate, getMonth, getYear } from 'date-fns';

import IUnavailablesRepository from '@modules/unavailables/repositories/IUnavailablesRepository';

import IUnavailableDTO from '@modules/unavailables/dtos/IUnavailableDTO';
import IFindUnavailableByDateDTO from '@modules/unavailables/dtos/IFindUnavailableByDateDTO';
import IFindAllInDayUnavailableByDateDTO from '@modules/unavailables/dtos/IFindAllInDayUnavailableByDateDTO';

import Unavailable from '@modules/unavailables/infra/typeorm/entities/Unavailable';

class FakeAvailabilitiesRepository implements IUnavailablesRepository {
  private unavailables: Unavailable[] = [];

  public async create({
    provider_id,
    date,
    is_unavailable,
  }: IUnavailableDTO): Promise<Unavailable> {
    const newUnavailable = new Unavailable();

    Object.assign(newUnavailable, {
      id: uuid(),
      date,
      provider_id,
      is_unavailable,
    });

    this.unavailables.push(newUnavailable);

    return newUnavailable;
  }

  public async findUnavailableByDate({
    provider_id,
    date,
  }: IFindUnavailableByDateDTO): Promise<Unavailable | undefined> {
    const findUnavailable = this.unavailables.find(
      unavailable =>
        unavailable.provider_id === provider_id &&
        isEqual(unavailable.date, date),
    );

    return findUnavailable;
  }

  public async findAllInDayUnavailable({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayUnavailableByDateDTO): Promise<Unavailable[]> {
    const findUnavailable = this.unavailables.filter(
      unavailable =>
        unavailable.provider_id === provider_id &&
        getDate(unavailable.date) === day &&
        getMonth(unavailable.date) + 1 === month &&
        getYear(unavailable.date) === year,
    );

    return findUnavailable;
  }

  public async save(unavailable: Unavailable): Promise<Unavailable> {
    const findIndex = this.unavailables.findIndex(
      findUnavailable => findUnavailable.id === unavailable.id,
    );

    this.unavailables[findIndex] = unavailable;

    return unavailable;
  }
}

export default FakeAvailabilitiesRepository;
