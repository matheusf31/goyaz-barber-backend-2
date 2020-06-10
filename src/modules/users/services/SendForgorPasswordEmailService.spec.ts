import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@gmail.com',
      phone: '994622353',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@gmail.com',
      phone: '994622353',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });

  it('it should delete the old token to create a new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@gmail.com',
      phone: '994622353',
      password: '123456',
    });

    const oldToken = await fakeUserTokensRepository.generate(user.id);

    await sendForgotPasswordEmail.execute({
      email: 'test@gmail.com',
    });

    expect(fakeUserTokensRepository.findByToken(oldToken.token)).toMatchObject(
      {},
    );
  });
});
