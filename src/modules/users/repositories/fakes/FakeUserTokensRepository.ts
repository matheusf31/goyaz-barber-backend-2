import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: 'any-token-123',
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }

  public async findTokenByUserId(
    user_id: string,
  ): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.user_id === user_id,
    );

    return userToken;
  }

  public async deleteOldToken(token: UserToken): Promise<void> {
    const findIndex = this.userTokens.findIndex(
      findToken => findToken.id === token.id,
    );

    this.userTokens.splice(findIndex, 1);
  }
}

export default FakeUserTokensRepository;
