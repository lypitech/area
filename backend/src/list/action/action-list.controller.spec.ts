import { Test, TestingModule } from '@nestjs/testing';
import { ActionListController } from './action-list.controller';

describe('SelectionController', () => {
  let controller: ActionListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionListController],
    }).compile();

    controller = module.get<ActionListController>(ActionListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
