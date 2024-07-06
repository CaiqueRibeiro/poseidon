import { Test, TestingModule } from '@nestjs/testing';
import { poolMock, poolServiceMock } from './pool.service.mock';
import { PoolController } from '../../src/pool/pool.controller';
import { authServiceMock } from '../auth/auth.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('PoolController tests', () => {
  let poolController: PoolController;

  beforeAll(async () => {
    const modelFixture: TestingModule = await Test.createTestingModule({
      controllers: [PoolController],
      providers: [poolServiceMock, authServiceMock],
    }).compile();

    poolController = modelFixture.get<PoolController>(PoolController);
  });

  it('should be defined', () => {
    expect(poolController).toBeDefined();
  });

  it('should get pool', async () => {
    const pool = await poolController.getPool(poolMock.id);
    expect(pool).toBeDefined();
    expect(pool.id).toEqual(poolMock.id);
  });

  it('should throw error get pool is not found', async () => {
    poolServiceMock.useValue.getPool.mockRejectedValue(new NotFoundException());
    await expect(poolController.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('should search pool', async () => {
    const pool = await poolController.searchPool(poolMock.symbol, poolMock.fee);
    expect(pool).toBeDefined();
    expect(pool.id).toEqual(poolMock.id);
    expect(pool.symbol).toEqual(poolMock.symbol);
    expect(pool.fee).toEqual(poolMock.fee);
  });

  it('should throw error if search pool is not found', async () => {
    poolServiceMock.useValue.searchPool.mockRejectedValue(
      new NotFoundException(),
    );
    await expect(
      poolController.searchPool(poolMock.symbol, poolMock.fee),
    ).rejects.toEqual(new NotFoundException());
  });

  it('should get pools', async () => {
    const pools = await poolController.getPools(1, 10);
    expect(pools).toBeDefined();
    expect(pools).toHaveLength(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

  it('should get top pools', async () => {
    const pools = await poolController.getTopPools();
    expect(pools).toBeDefined();
    expect(pools).toHaveLength(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

  it('should get pool symbols', async () => {
    const symbols = await poolController.getPoolSymbols();
    expect(symbols).toBeDefined();
    expect(symbols).toHaveLength(1);
    expect(symbols[0]).toEqual(poolMock.symbol);
  });
});
