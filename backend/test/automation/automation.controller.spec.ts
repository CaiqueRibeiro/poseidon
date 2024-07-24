import { Test, TestingModule } from '@nestjs/testing';
import { AutomationController } from '../../src/automation/automation.controller';
import { authServiceMock } from '../auth/auth.service.mock';
import {
  activeAutomationMock,
  automationServiceMock,
  inactiveAutomationMock,
  newAutomationMock,
} from './automation.service.mock';
import { poolServiceMock } from '../pool/pool.service.mock';
import { activeUserMock, userServiceMock } from '../user/user.service.mock';
import { AutomationDTO } from '../../src/automation/automation.dto';

describe('AutomationController tests', () => {
  let automationController: AutomationController;

  const authorization = 'authorization 123';

  beforeAll(async () => {
    const modelFixture: TestingModule = await Test.createTestingModule({
      controllers: [AutomationController],
      providers: [
        automationServiceMock,
        poolServiceMock,
        userServiceMock,
        authServiceMock,
      ],
    }).compile();

    automationController =
      modelFixture.get<AutomationController>(AutomationController);
  });

  it('should be defined', () => {
    expect(automationController).toBeDefined();
  });

  it('should get automation', async () => {
    const automation = await automationController.getAutomation(
      newAutomationMock.id,
      authorization,
    );
    expect(automation).toBeDefined();
    expect(automation!.id).toEqual(newAutomationMock.id);
  });

  it('should get automations', async () => {
    const automation = await automationController.getAutomations(authorization);
    expect(automation).toBeDefined();
    expect(automation.length).toEqual(1);
    expect(automation[0].id).toEqual(newAutomationMock.id);
  });

  it('should get active automations', async () => {
    const automation =
      await automationController.getActiveAutomations(authorization);
    expect(automation).toBeDefined();
    expect(automation.length).toEqual(1);
    expect(automation[0].id).toEqual(newAutomationMock.id);
    expect(automation[0].isActive).toBeTruthy();
  });

  it('should add automation', async () => {
    const automationData = { ...activeAutomationMock } as AutomationDTO;
    const result = await automationController.addAutomation(
      automationData,
      authorization,
    );
    expect(result.id).toBeTruthy();
  });

  it('should add automation (opened)', async () => {
    const automationData = {
      ...activeAutomationMock,
      isOpened: true,
      closeCondition: undefined,
    } as AutomationDTO;
    const result = await automationController.addAutomation(
      automationData,
      authorization,
    );
    expect(result.id).toBeTruthy();
  });

  it('should add automation (price1)', async () => {
    const automationData = {
      ...activeAutomationMock,
      openCondition: { field: 'price1', operator: '==', value: '0' },
    } as AutomationDTO;
    const result = await automationController.addAutomation(
      automationData,
      authorization,
    );
    expect(result.id).toBeTruthy();
  });

  it('should not be able to add automation if private key is not informed', async () => {
    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue({ ...activeUserMock, privateKey: null });

    const automationData = { ...activeAutomationMock } as AutomationDTO;
    await expect(
      automationController.addAutomation(automationData, authorization),
    ).rejects.toEqual(new Error('You must have your private key in settings'));

    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue(activeUserMock);
  });

  it('should update automation (inactive)', async () => {
    const automationData = { ...inactiveAutomationMock };
    const result = await automationController.updateAutomation(
      inactiveAutomationMock.id!,
      automationData,
      authorization,
    );
    expect(result.id).toEqual(inactiveAutomationMock.id);
  });

  it('should update automation (opened)', async () => {
    const automationData = {
      ...activeAutomationMock,
      isOpened: true,
      closeCondition: undefined,
    };
    const result = await automationController.updateAutomation(
      activeAutomationMock.id!,
      automationData,
      authorization,
    );
    expect(result.id).toEqual(activeAutomationMock.id);
  });

  it('should update automation (no poolId)', async () => {
    automationServiceMock.useValue.updateAutomation = jest
      .fn()
      .mockResolvedValue({ ...activeAutomationMock, poolId: '' });

    const automationData = { ...inactiveAutomationMock };
    const result = await automationController.updateAutomation(
      inactiveAutomationMock.id!,
      automationData,
      authorization,
    );
    expect(result.isActive).toBeTruthy();
    expect(result.poolId).toBeFalsy();

    automationServiceMock.useValue.updateAutomation = jest
      .fn()
      .mockResolvedValue(activeAutomationMock);
  });

  it('should update automation (price1)', async () => {
    const automationData = {
      ...activeAutomationMock,
      openCondition: {
        field: 'price1',
        operator: '==',
        value: '0',
      },
    };
    const result = await automationController.updateAutomation(
      activeAutomationMock.id!,
      automationData,
      authorization,
    );
    expect(result.id).toEqual(activeAutomationMock.id);
  });

  it('should not be able to update automation if private key is not informed', async () => {
    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue({ ...activeUserMock, privateKey: null });

    const automationData = { ...activeAutomationMock } as AutomationDTO;
    await expect(
      automationController.updateAutomation(
        activeAutomationMock.id!,
        automationData,
        authorization,
      ),
    ).rejects.toEqual(new Error('You must have your private key in settings'));

    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue(activeUserMock);
  });

  it('should delete automation', async () => {
    const result = await automationController.deleteAutomation(
      activeAutomationMock.id!,
      authorization,
    );
    expect(result.id).toEqual(activeAutomationMock.id);
  });

  it('should start automation', async () => {
    const result = await automationController.startAutomation(
      inactiveAutomationMock.id!,
      authorization,
    );
    expect(result.id).toEqual(inactiveAutomationMock.id);
  });

  it('should start automation (no poolId)', async () => {
    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue({ ...activeAutomationMock, poolId: '' });

    const result = await automationController.startAutomation(
      inactiveAutomationMock.id!,
      authorization,
    );
    expect(result.isActive).toBeTruthy();
    expect(result.poolId).toBeFalsy();

    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue(activeAutomationMock);
  });

  it('should start automation (isOpened)', async () => {
    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue({
        ...activeAutomationMock,
        isOpened: true,
        closeCondition: undefined,
      });

    const result = await automationController.startAutomation(
      inactiveAutomationMock.id!,
      authorization,
    );
    expect(result.isActive).toBeTruthy();

    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue(activeAutomationMock);
  });

  it('should start automation (price1)', async () => {
    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue({
        ...activeAutomationMock,
        openCondition: {
          field: 'price1',
          operator: '==',
          value: '0',
        },
      });

    const result = await automationController.startAutomation(
      inactiveAutomationMock.id!,
      authorization,
    );
    expect(result.isActive).toBeTruthy();

    automationServiceMock.useValue.startAutomation = jest
      .fn()
      .mockResolvedValue(activeAutomationMock);
  });

  it('should not be able to start automation if private key is not informed', async () => {
    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue({ ...activeUserMock, privateKey: null });

    await expect(
      automationController.startAutomation(
        inactiveAutomationMock.id,
        authorization,
      ),
    ).rejects.toEqual(new Error('You must have your private key in settings'));

    userServiceMock.useValue.getUser = jest
      .fn()
      .mockResolvedValue(activeUserMock);
  });

  it('should stop automation', async () => {
    const result = await automationController.stopAutomation(
      activeAutomationMock.id!,
      authorization,
    );
    expect(result.id).toEqual(activeAutomationMock.id);
  });
});
