import { injectable, inject } from 'tsyringe';

import Unavailable from '../infra/typeorm/entities/Unavailable';

import IUnavailablesRepository from '../repositories/IUnavailablesRepository';

interface IRequest {
  provider_id: string;
  date: Date;
  is_unavailable: boolean;
}

@injectable()
class MarkDayUnavailableService {
  constructor(
    @inject('UnavailablesRepository')
    private unavailablesRepository: IUnavailablesRepository,
  ) {}

  public async execute({
    provider_id,
    date,
    is_unavailable,
  }: IRequest): Promise<Unavailable> {
    const existHourUnavailable = await this.unavailablesRepository.findUnavailableByDate(
      {
        date,
        provider_id,
      },
    );

    if (existHourUnavailable) {
      existHourUnavailable.is_unavailable = is_unavailable;

      return this.unavailablesRepository.save(existHourUnavailable);
    }

    const availability = await this.unavailablesRepository.create({
      provider_id,
      date,
      is_unavailable,
    });

    return availability;
  }
}

export default MarkDayUnavailableService;
