import { getRepository, Repository } from 'typeorm';

import IAdditionalsRepository from '@modules/appointments/repositories/IAdditionalsRepository';

import Additional from '@modules/appointments/infra/typeorm/entities/Additional';

class FakeAdditionalsRepository implements IAdditionalsRepository {
  private ormRepository: Repository<Additional>;

  constructor() {
    this.ormRepository = getRepository(Additional);
  }

  public async updateAdditional(): Promise<void> {
    // TODO
  }
}

export default FakeAdditionalsRepository;
