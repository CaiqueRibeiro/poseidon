import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'commons/models/pool';
import db from '../db';
import { Prisma } from 'commons/data';

type TopPool = Pool & { topChange: number };
type SymbolArr = Array<{ _id: string }>;

@Injectable()
export class PoolService {
  async getPool(id: string): Promise<Pool> {
    const pool = await db.pools.findUnique({
      where: { id },
    });

    if (!pool) {
      throw new NotFoundException();
    }

    return pool;
  }

  async searchPool(symbol: string): Promise<Pool[]> {
    const pools = await db.pools.findMany({
      where: {
        symbol: {
          equals: symbol,
          mode: 'insensitive',
        },
      },
    });

    if (!pools || pools.length == 0) {
      throw new NotFoundException();
    }

    return pools;
  }

  async getPools(page: number = 1, pageSize: number = 20): Promise<Pool[]> {
    const pools = await db.pools.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return pools;
  }

  async getPoolSymbols(): Promise<string[]> {
    const symbols = (await db.pools.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: '$symbol',
            count: {
              $sum: 1,
            },
          },
        },
      ],
    })) as unknown as SymbolArr;

    if (!symbols) return [];
    return symbols.map((s) => s._id).sort();
  }

  async getTopPools(): Promise<Pool[]> {
    const oneHourAgo = new Date(Date.now() - 1 * 61 * 60 * 1000);

    // positive token 0, negative token 1
    const top0Pools = (await db.pools.findMany({
      take: 5,
      where: {
        price0Change_60: { gt: 0 },
        price1Change_60: { lt: 0 },
        lastUpdate_60: { gt: oneHourAgo },
      },
      orderBy: { price0Change_60: Prisma.SortOrder.desc },
    })) as TopPool[];

    top0Pools.forEach((v, i, a) => {
      a[i].topChange =
        (v.price0Change_60 || 0) + Math.abs(v.price1Change_60 || 0);
    });

    const top1Pools = (await db.pools.findMany({
      take: 5,
      where: {
        price1Change_60: { gt: 0 },
        price0Change_60: { lt: 0 },
        lastUpdate_60: { gt: oneHourAgo },
      },
      orderBy: { price1Change_60: Prisma.SortOrder.desc },
    })) as TopPool[];

    top1Pools.forEach((v, i, a) => {
      a[i].topChange =
        (v.price1Change_60 || 0) + Math.abs(v.price0Change_60 || 0);
    });

    const topPools = [...top0Pools, ...top1Pools];
    return topPools.sort((a, b) => b.topChange - a.topChange).slice(0, 5);
  }
}
