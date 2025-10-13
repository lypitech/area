import { Test, TestingModule } from '@nestjs/testing';
import { ReactionListController } from './reaction-list.controller';

describe('SelectionController', () => {
  let controller: ReactionListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionListController],
    }).compile();

    controller = module.get<ReactionListController>(ReactionListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
