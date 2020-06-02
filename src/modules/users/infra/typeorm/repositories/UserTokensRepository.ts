import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    let randomToken = '';

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const charactersLength = characters.length;

    for (let i = 0; i < 5; i++) {
      randomToken += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }

    const userToken = this.ormRepository.create({
      user_id,
      token: randomToken,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async findTokenByUserId(
    user_id: string,
  ): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { user_id },
    });

    return userToken;
  }

  public async deleteOldToken(token: UserToken): Promise<void> {
    await this.ormRepository.delete(token.id);
  }
}

export default UserTokensRepository;
