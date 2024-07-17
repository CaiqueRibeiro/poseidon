import { ChainId } from "./chainId";
import { Exchange } from "./exchange";

export type Condition = {
    field: string;
    operator: string;
    value: string;
}

export class Automation {
    id?: string;
    userId: string;
    name: string;
    exchange: Exchange;
    network: ChainId;
    poolId: string | null;
    openCondition: Condition;
    closeCondition: Condition | null;
    isOpened: boolean;
    isActive: boolean;
    nextAmount: string;

    constructor(automation: Automation) {
        this.id = automation.id;
        this.userId = automation.userId;
        this.name = automation.name;
        this.exchange = automation.exchange || Exchange.Uniswap;
        this.network = automation.network || ChainId.MAINNET;
        this.poolId = automation.poolId;
        this.openCondition = automation.openCondition;
        this.closeCondition = automation.closeCondition;
        this.isOpened = automation.isOpened;
        this.isActive = automation.isActive;
        this.nextAmount = automation.nextAmount;
    }
}