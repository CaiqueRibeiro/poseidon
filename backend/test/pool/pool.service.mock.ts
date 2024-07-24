import { PoolService } from '../../src/pool/pool.service';

export const poolMock = {
  id: '0x01037d4d2fbabcd3fb97b8fb97f00f00161b5fc3',
  token0: '0x249ca82617ec3dfb2589c4c17ab7ec9765350a18',
  token1: '0x51491077af9ca656af840dff83e8264ecf986ca',
  symbol: 'VERSELINK',
  symbol0: 'VERSE',
  symbol1: 'LINK',
  fee: 3000,
  exchange: 1,
  network: 1,
  price0: 23967.501059447,
  price0Change: 0,
  price0_15: 0,
  price0Change_15: 0,
  price0_60: 0,
  price0Change_60: 0,
  price1: 0.000041723,
  price1Change: 0,
  price1_15: 0,
  price1Change_15: 0,
  price1_60: 0,
  price1Change_60: 0,
  lastUpdate: new Date(),
  lastUpdate_15: new Date(),
  lastUpdate_60: new Date(),
};

export const poolServiceMock = {
  provide: PoolService,
  useValue: {
    getPool: jest.fn().mockResolvedValue(poolMock),
    searchPool: jest.fn().mockResolvedValue([poolMock]),
    getPools: jest.fn().mockResolvedValue([poolMock]),
    getPoolSymbols: jest.fn().mockResolvedValue([poolMock.symbol]),
    getTopPools: jest.fn().mockResolvedValue([poolMock]),
  },
};
