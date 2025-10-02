import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Expression } from 'mongoose';
import { LoginService } from './login.service';

jest.mock('bcrypt');

describe('LoginService', () => {
  let loginService: LoginService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserService,
          useValue: {
            createNew: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('Should call UserService.createNew with the right arguments', async () => {
      const expected: User = {
        nickname: 'shuvlyy',
        username: 'Ly',
        password:
          '$2b$10$GAz3Qgcr0oaTSWcdk4K6iuPyZAAdRDQtPk/IEj0MTbnTvGJjSn4y.',
        email: 'tester@example.com',
        profilePicture: '',
        _id: '68de3a7e912a9b2b8d7f464e',
        uuid: '76d67e05-5d75-416c-9d20-b456da8fe300',
      } as unknown as User;
      userService.createNew.mockResolvedValueOnce(expected);
      const result = await loginService.register(
        'test@mail.com',
        'password1234',
        'username',
        'nick',
      );

      expect(userService.createNew).toHaveBeenCalledWith(
        'test@mail.com',
        'password1234',
        'nick',
        'username',
      );
      expect(result).toEqual(expected);
    });
  });

  describe('login', () => {
    it('Should throw UnauthorizedException if user not found', async () => {
      await expect(
        loginService.login('wrong@gmail.com', 'pass123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should throw UnauthorizedException if password doesnt match', async () => {
      userService.findByEmail.mockResolvedValueOnce({
        email: 'test@mail.com',
        password: 'HashedPassword',
        _id: '1',
      } as unknown as User);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        loginService.login('test@mail.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should return access_token if valid credentials', async () => {
      userService.findByEmail.mockResolvedValueOnce({
        email: 'test@mail.com',
        password: 'HashedPassword',
        _id: '1',
      } as unknown as User);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jwtService.sign.mockReturnValueOnce('signedToken');

      const result = await loginService.login('test@mail.com', 'Password1234');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password1234',
        'HashedPassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@mail.com',
      });
      expect(result).toEqual({ access_token: 'signedToken' });
    });
  });
});
