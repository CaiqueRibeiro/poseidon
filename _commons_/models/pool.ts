import { ChainId } from "./chainId";
import { Exchange } from "./exchange";

export class Pool {
    id: string;
    token0: string;
    token1: string;
    symbol0: string;
    symbol1: string;
    symbol: string;
    decimals0: number;
    decimals1: number;
    fee: number;
    exchange: Exchange;
    network: ChainId;
    price0: number;
    price0Change: number;
    price0_15: number | null;
    price0Change_15: number | null;
    price0_60: number | null;
    price0Change_60: number | null;
    price1: number;
    price1Change: number;
    price1_15: number | null;
    price1Change_15: number | null;
    price1_60: number | null;
    price1Change_60: number | null;
    lastUpdate: Date;
    lastUpdate_15: Date | null;
    lastUpdate_60: Date | null;

    constructor(pool: Pool) {
        this.id = pool.id;
        this.token0 = pool.token0;
        this.token1 = pool.token1;
        this.symbol0 = pool.symbol0;
        this.symbol1 = pool.symbol1;
        this.symbol = pool.symbol;
        this.decimals0 = pool.decimals0;
        this.decimals1 = pool.decimals1;
        this.fee = pool.fee;
        this.exchange = pool.exchange;
        this.network = pool.network;

        this.price0 = pool.price0 || 0;
        this.price0Change = pool.price0Change || 0;
        this.lastUpdate = pool.lastUpdate || new Date();

        this.price0_15 = pool.price0_15 || 0;
        this.price0Change_15 = pool.price0Change_15 || 0;
        this.lastUpdate_15 = pool.lastUpdate_15 || new Date();

        this.price0_60 = pool.price0_60 || 0;
        this.price0Change_60 = pool.price0Change_60 || 0;
        this.lastUpdate_60 = pool.lastUpdate_60 || new Date();

        this.price1 = pool.price1 || 0;
        this.price1Change = pool.price1Change || 0;

        this.price1_15 = pool.price1_15 || 0;
        this.price1Change_15 = pool.price1Change_15 || 0;

        this.price1_60 = pool.price1_60 || 0;
        this.price1Change_60 = pool.price1Change_60 || 0;
    }
}