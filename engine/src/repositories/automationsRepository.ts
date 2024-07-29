import { ChainId } from 'commons/models/chainId';
import connect from './db';
import { Automation } from 'commons/models/automation';
import { Exchange } from 'commons/models/exchange';

async function getAutomation(id: string, userId: string): Promise<Automation | null> {
    const db = await connect();
    return db.automations.findUnique({
        where: { id, userId }
    });
}

async function getAutomations(userId: string, network: ChainId, exchange: Exchange): Promise<Automation[]> {
    const db = await connect();
    return db.automations.findMany({
        where: { userId, network, exchange }
    });
}

async function searchAutomation(poolId: string): Promise<Automation[]> {
    const db = await connect();
    return db.automations.findMany({
        where: {
            OR: [{ poolId}, { poolId: null }],
            isActive: true,
        }
    });
}

async function addAutomation(automation: Automation): Promise<Automation> {
    if (!automation.userId) throw new Error('Invalid automation userId');
    const db = await connect();
    return db.automations.create({
        data: new Automation(automation)
    });
}

async function startAutomations(userId: string): Promise<void> {
    const db = await connect();
    await db.automations.updateMany({
        where: { userId },
        data: { isActive: true }
    });
}

async function stopAutomations(userId: string): Promise<void> {
    const db = await connect();
    await db.automations.updateMany({
        where: { userId },
        data: { isActive: false }
    });
}

async function updateAutomation(automationData: Automation): Promise<Automation | null> {
    if (!automationData.id || !automationData.userId) throw new Error('Invalid automation userId');
    const db = await connect();
    await db.automations.update({
        where: { id: automationData.id, userId: automationData.userId },
        data: {
            name: automationData.name,
            openCondition: automationData.openCondition,
            closeCondition: automationData.closeCondition,
            isActive: automationData.isActive,
            isOpened: automationData.isOpened,
            network: automationData.network,
            exchange: automationData.exchange,
            nextAmount: automationData.nextAmount,
            poolId: automationData.poolId,
            pnl: automationData.pnl,
            tradeCount: automationData.tradeCount
        }
    });

    return getAutomation(automationData.id, automationData.userId);
}

async function deleteAutomation(id: string, userId: string): Promise<boolean> {
    const db = await connect();
    db.automations.delete({
        where: { id, userId }
    });
    return true;
}

export default {
    getAutomation,
    getAutomations,
    searchAutomation,
    addAutomation,
    deleteAutomation,
    updateAutomation,
    startAutomations,
    stopAutomations,
};

