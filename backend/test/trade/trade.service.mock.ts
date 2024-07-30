import { Trade } from 'commons/models/trade';
import { TradeService } from '../../src/trade/trade.service';

export const newTrade = {
  id: 'trade123',
  automationId: 'automation123',
  userId: 'user123',
  openAmountIn: '10',
  openAmountOut: '10',
  openPrice: 10,
  closeAmountIn: '10',
  closeAmountOut: '10',
  closeDate: new Date(),
  closePrice: 10,
  openDate: new Date(Date.now() - 1),
  pnl: 10,
} as Trade;

export const tradeServiceMock = {
  provide: TradeService,
  useValue: {
    getClosedTrades: jest.fn().mockResolvedValue([newTrade]),
  },
};
