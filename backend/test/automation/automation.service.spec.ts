import { Test, TestingModule } from '@nestjs/testing';
import { AutomationService } from '../../src/automation/automation.service';
import { prismaMock } from '../db.mock';
import { automations } from 'commons/data';
import {
  activeAutomationMock,
  inactiveAutomationMock,
  newAutomationMock,
} from './automation.service.mock';
import { AutomationDTO } from '../../src/automation/automation.dto';

describe('AutomationService tests', () => {
  let automationService: AutomationService;

  beforeAll(async () => {
    const modelFixture: TestingModule = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile();

    automationService = modelFixture.get<AutomationService>(AutomationService);
  });

  it('Should be defined', () => {
    expect(automationService).toBeDefined();
  });

  it('Should get an automation', async () => {
    prismaMock.automations.findFirst.mockResolvedValue({
      ...newAutomationMock,
    } as automations);

    const result = await automationService.getAutomation(
      newAutomationMock.id!,
      newAutomationMock.userId,
    );
    expect(result).toBeDefined();
    expect(result!.id).toEqual(newAutomationMock.id);
  });

  it('Should get automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...newAutomationMock },
    ] as automations[]);

    const result = await automationService.getAutomations(
      newAutomationMock.userId,
    );
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(newAutomationMock.id);
  });

  it('Should get active automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...newAutomationMock, ...inactiveAutomationMock },
    ] as automations[]);

    const result = await automationService.getActiveAutomations(
      newAutomationMock.userId,
    );
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(newAutomationMock.id);
  });

  it('Should add an automation', async () => {
    prismaMock.automations.create.mockResolvedValue({
      ...newAutomationMock,
    } as automations);

    const automation = { ...newAutomationMock } as AutomationDTO;
    const result = await automationService.addAutomation(
      newAutomationMock.userId,
      automation,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('Should add an automation', async () => {
    prismaMock.automations.create.mockResolvedValue({
      ...inactiveAutomationMock,
    } as automations);

    const automation = { ...inactiveAutomationMock } as AutomationDTO;
    const result = await automationService.addAutomation(
      inactiveAutomationMock.userId,
      automation,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('Should add an automation (inactive)', async () => {
    prismaMock.automations.create.mockResolvedValue({
      ...inactiveAutomationMock,
    } as automations);

    const automation = { ...newAutomationMock } as AutomationDTO;
    const result = await automationService.addAutomation(
      newAutomationMock.userId,
      automation,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('Should start an automation', async () => {
    prismaMock.automations.findFirst.mockResolvedValue({
      ...inactiveAutomationMock,
    } as automations);
    prismaMock.automations.update.mockResolvedValue({
      ...activeAutomationMock,
    } as automations);

    const result = await automationService.startAutomation(
      newAutomationMock.id,
      newAutomationMock.userId,
    );
    expect(result.id).toEqual(inactiveAutomationMock.id);
    expect(result.isActive).toBeTruthy();
  });

  it('Should stop an automation', async () => {
    prismaMock.automations.findFirst.mockResolvedValue({
      ...activeAutomationMock,
    } as automations);
    prismaMock.automations.update.mockResolvedValue({
      ...inactiveAutomationMock,
    } as automations);

    const result = await automationService.stopAutomation(
      newAutomationMock.id,
      newAutomationMock.userId,
    );
    expect(result.id).toEqual(inactiveAutomationMock.id);
    expect(result.isActive).toBeFalsy();
  });

  it('Should update an automation', async () => {
    prismaMock.automations.update.mockResolvedValue({
      ...newAutomationMock,
    } as automations);

    const result = await automationService.updateAutomation(
      newAutomationMock.id,
      newAutomationMock.userId,
      { ...newAutomationMock },
    );
    expect(result.id).toEqual(newAutomationMock.id);
  });

  it('Should update an automation (inactive)', async () => {
    prismaMock.automations.update.mockResolvedValue({
      ...inactiveAutomationMock,
    } as automations);

    const result = await automationService.updateAutomation(
      inactiveAutomationMock.id,
      inactiveAutomationMock.userId,
      { ...inactiveAutomationMock },
    );
    expect(result.id).toEqual(inactiveAutomationMock.id);
  });

  it('Should delete an automation', async () => {
    prismaMock.automations.delete.mockResolvedValue({
      ...newAutomationMock,
    } as automations);

    const result = await automationService.deleteAutomation(
      newAutomationMock.id,
      newAutomationMock.userId,
    );
    expect(result.id).toEqual(newAutomationMock.id);
  });
});
