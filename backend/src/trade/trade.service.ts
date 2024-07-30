import { Trade } from 'commons/models/trade';
import db from '../db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeService {
  async getClosedTrades(
    userId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<Trade[]> {
    return db.trades.findMany({
      where: {
        userId,
        closeDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
    });
  }
}
