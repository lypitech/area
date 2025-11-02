import { Test, TestingModule } from '@nestjs/testing';
import { ReactionListService } from './reaction-list.service';

describe('SelectionService', () => {
  let service: ReactionListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionListService],
    }).compile();

    service = module.get<ReactionListService>(ReactionListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
