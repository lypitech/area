import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from './hook.controller';

describe('HookController', () => {
  let controller: HookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HookController],
    }).compile();

    controller = module.get<HookController>(HookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
