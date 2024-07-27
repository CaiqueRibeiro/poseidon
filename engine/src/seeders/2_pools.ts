import { ISeeder } from './ISeeder';
import Config from '../config';
import { PoolData } from 'commons/services/uniswapTypes';
import { getTopPools } from 'commons/services/uniswapService';
import poolsRepository from 'src/repositories/poolsRepository';
import { Pool } from 'commons/models/pool';

export class PoolsSeder implements ISeeder {
    async execute(): Promise<void> {
        console.log(`Initializing pools seeder`);

        console.log(`Checking if the pools already exist...`);
        const count = await poolsRepository.countPools(Config.EXCHANGE_2, Config.NETWORK_2);
        if (count > 2) {
            console.log(`Pools already exist. Exiting...`);
            return;
        }

        let skip: number = 0;
        let pools: PoolData[] = [];

        do {
            pools = await getTopPools(1000, skip);
            console.log(`Loaded ${pools.length} tokens...`)

            for(let i = 0; i < pools.length; i++) {
                const pool = pools[i];

                console.log(pool.id);

                await poolsRepository.addPool(new Pool({
                    id: pool.id,
                    exchange: Config.EXCHANGE_2,
                    network: Config.NETWORK_2,
                    fee: Number(pool.feeTier),
                    symbol: pool.token0.symbol + pool.token1.symbol,
                    symbol0: pool.token0.symbol,
                    symbol1: pool.token1.symbol,
                    token0: pool.token0.id,
                    token1: pool.token1.id,
                    price0: parseFloat(pool.token0Price),
                    price1: parseFloat(pool.token1Price),
                    decimals0: Number(pool.token0.decimals),
                    decimals1: Number(pool.token1.decimals)
                } as Pool));
            }

            skip += pools.length;
            console.log(`Processed ${pools.length} pools...`);
        } while(pools.length > 0)

        console.log(`Finalized token seeder`);
    }
}

export default new PoolsSeder();