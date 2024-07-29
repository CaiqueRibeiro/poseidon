import { ChainId } from 'commons/models/chainId';
import { Exchange } from 'commons/models/exchange';
import { AutomationService } from '../../src/automation/automation.service';

export const newAutomationMock = {
  id: 'automation123',
  name: 'Automation Test',
  userId: 'user123',
  poolId: 'pool123',
  isActive: true,
  isOpened: false,
  exchange: Exchange.Uniswap,
  network: ChainId.MAINNET,
  nextAmount: '10',
  openCondition: {
    field: 'price0',
    operator: '=',
    value: '0',
  },
  closeCondition: {
    field: 'price0',
    operator: '>=',
    value: '5',
  },
  pnl: 10,
  tradeCount: 10,
};

export const activeAutomationMock = {
  ...newAutomationMock,
  isActive: true,
};

export const inactiveAutomationMock = {
  ...newAutomationMock,
  isActive: false,
};

export const automationServiceMock = {
  provide: AutomationService,
  useValue: {
    getAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    getAutomations: jest.fn().mockResolvedValue([newAutomationMock]),
    getActiveAutomations: jest.fn().mockResolvedValue([activeAutomationMock]),
    addAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    startAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    stopAutomation: jest.fn().mockResolvedValue(inactiveAutomationMock),
    updateAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    deleteAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
  },
};
