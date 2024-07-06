import { Test, TestingModule } from '@nestjs/testing';
import { PoolService } from '../../src/pool/pool.service';
import { prismaMock } from '../db.mock';
import { poolMock } from './pool.service.mock';
import { pools } from 'commons/data';
import { JsonObject } from 'commons/data/runtime/library';
import { NotFoundException } from '@nestjs/common';

describe('PoolService tests', () => {
  let poolService: PoolService;

  beforeAll(async () => {
    const modelFixture: TestingModule = await Test.createTestingModule({
      providers: [PoolService],
    }).compile();

    poolService = modelFixture.get<PoolService>(PoolService);
  });

  it('Should be defined', () => {
    expect(poolService).toBeDefined();
  });

  it('should get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue({ ...poolMock } as pools);
    const result = await poolService.getPool(poolMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(poolMock.id);
  });

  it('should throw error if pool is not found in get Pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue(null);
    await expect(poolService.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('should search pool', async () => {
    prismaMock.pools.findFirst.mockResolvedValue({ ...poolMock } as pools);
    const result = await poolService.searchPool(poolMock.symbol, poolMock.fee);
    expect(result).toBeDefined();
    expect(result.symbol).toEqual(poolMock.symbol);
    expect(result.fee).toEqual(poolMock.fee);
  });

  it('should throw error if pool is not found in searchPool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue(null);
    await expect(
      poolService.searchPool(poolMock.symbol, poolMock.fee),
    ).rejects.toEqual(new NotFoundException());
  });

  it('should get pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock } as pools]);
    const result = await poolService.getPools(1, 10);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should get pools with default values', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock } as pools]);
    const result = await poolService.getPools();
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue([
      { _id: poolMock.symbol },
    ] as unknown as JsonObject);
    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(poolMock.symbol);
  });

  it('should return an empty array if no symbol were found', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue(null!);
    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result).toHaveLength(0);
  });

  it('should get top pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock } as pools]);
    const result = await poolService.getTopPools();
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(poolMock.id);
  });
});
