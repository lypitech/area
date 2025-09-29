import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './action.service';

describe('ActionsService', () => {
  let service: ActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsService],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
