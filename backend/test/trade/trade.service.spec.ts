import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from '../../src/trade/trade.service';
import { prismaMock } from '../db.mock';
import { newTrade } from './trade.service.mock';
import { trades } from 'commons/data';

describe('TradeService tests', () => {
  const userId = 'user123';
  let tradeService: TradeService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [TradeService],
    }).compile();

    tradeService = moduleFixture.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(tradeService).toBeDefined();
  });

  it('should get closed trades', async () => {
    prismaMock.trades.findMany.mockResolvedValue([{ ...newTrade } as trades]);
    const automations = await tradeService.getClosedTrades(
      userId,
      new Date(),
      new Date(),
    );
    expect(automations.length).toEqual(1);
  });
});
