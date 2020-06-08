// import { uuid } from 'uuidv4';

import IAdditionalsRepository from '@modules/appointments/repositories/IAdditionalsRepository';

import Additional from '@modules/appointments/infra/typeorm/entities/Additional';

class FakeAdditionalsRepository implements IAdditionalsRepository {
  private additionals: Additional[] = [];

  public async updateAdditional(): Promise<void> {
    // TODO
  }
}

export default FakeAdditionalsRepository;
