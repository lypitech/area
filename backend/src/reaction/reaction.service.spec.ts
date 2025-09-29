import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD
import { ReactionsService } from './reaction.service';

describe('ReactionsService', () => {
  let service: ReactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionsService],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
=======
import { ReactionService } from './reaction.service';

describe('ReactionService', () => {
  let service: ReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionService],
    }).compile();

    service = module.get<ReactionService>(ReactionService);
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
