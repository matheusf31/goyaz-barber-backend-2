import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  findTokenByUserId(user_id: string): Promise<UserToken | undefined>;
  deleteOldToken(token: UserToken): Promise<void>;
}
