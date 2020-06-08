// import Additional from '../infra/typeorm/entities/Additional';

export default interface AdditionalsRepository {
  updateAdditional(): Promise<void>;
}
