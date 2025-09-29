import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from './reaction.controller';

describe('ReactionController', () => {
  let controller: ReactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionsController],
    }).compile();

    controller = module.get<ReactionsController>(ReactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
