import { Test, TestingModule } from '@nestjs/testing';
import { authServiceMock } from '../auth/auth.service.mock';
import { TradeController } from '../../src/trade/trade.controller';
import { tradeServiceMock } from './trade.service.mock';

describe('TradeController tests', () => {
  let tradeController: TradeController;

  beforeAll(async () => {
    const modelFixture: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [tradeServiceMock, authServiceMock],
    }).compile();

    tradeController = modelFixture.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(tradeController).toBeDefined();
  });

  it('should get closed trades', async () => {
    const result = await tradeController.getClosedTrades(
      'authorization',
      Date.now() - 1,
      Date.now(),
    );
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
  });

  it('should get closed trades with default value', async () => {
    const result = await tradeController.getClosedTrades(
      'authorization',
      undefined as any,
      undefined as any,
    );
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
  });
});
