import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = {
  nickname: 'shuvlyy',
  username: 'Ly',
  password: 'password1',
  email: 'tester@example.com',
  profilePicture: '',
  _id: '1',
  uuid: '3',
} as User;
const mockAllUser: User[] = [
  {
    nickname: 'shuvlyy',
    username: 'Ly',
    password: 'password1',
    email: 'tester@example.com',
    profilePicture: '',
    _id: '1',
    uuid: '3',
  },
  {
    nickname: 'Pierre',
    username: 'Racaillou',
    password: 'password12',
    email: 'tester2@example.com',
    profilePicture: '',
    _id: '2',
    uuid: '4',
  },
] as unknown as User[];
const mockId = '123';
const mockIdError = 'error';
export const EXCLUDE_FIELDS = '-_id -__v';

class MockedUserModel {
  constructor(private _: any) {}
  new = jest.fn().mockResolvedValue({});
  static save = jest.fn().mockResolvedValue(mockUser);
  static find = jest.fn().mockReturnValue(mockAllUser);
  static create = jest.fn().mockReturnValue(mockUser);
  static findOneAndDelete = jest.fn().mockImplementation((id: string) => {
    if (id == mockIdError) throw new NotFoundException();
    return this;
  });
  static exec = jest.fn().mockReturnValue(mockUser);
  static select = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockImplementation((id: string) => {
    if (id == mockIdError) throw new NotFoundException();
    return this;
  });
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: MockedUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('basics', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('Should return an array of Users', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockAllUser);
    });
  });
});
