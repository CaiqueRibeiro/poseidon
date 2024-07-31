import Config from './config';
import poolsRepository from './repositories/poolsRepository';
import { getTopPools } from 'commons/services/uniswapService';
import WSSInit from './wss';
import poseidonExecution from './poseidon';

const WSS = WSSInit();

async function executionCycle() {
    const pages = Math.ceil(Config.POOL_COUNT / 1000);

    for(let i = 0; i < pages; i++) {
        const pools = await getTopPools(1000, i * 1000);
        console.log(`Loaded ${pools.length} pools...`);

        const bulResult = [];
        for(let j = 0; j < pools.length; j++) {
            const pool = pools[j];
            const poolResult = await poolsRepository.updatePrices(pool);
            if(!poolResult) continue;

            bulResult.push(poolResult);
            poseidonExecution(poolResult, WSS);
        }

        WSS.broadcast({
            event: 'priceUpdate',
            data: bulResult
        });
    }
}

export default () => {
    setInterval(executionCycle, Config.MONITOR_INTERVAL);
    executionCycle();
    console.log(`Execution cycle started at ${new Date().toISOString()}`);
}