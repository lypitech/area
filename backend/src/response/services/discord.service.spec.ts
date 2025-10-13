import { Test, TestingModule } from '@nestjs/testing';
import { DiscordReactionService } from './discord.service';

describe('DiscordReactionService', () => {
  let service: DiscordReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordReactionService],
    }).compile();

    service = module.get<DiscordReactionService>(DiscordReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
