import axios from 'axios';
import Config from '../configBase';
import { PoolData, TokenData } from './uniswapTypes';
import { ethers, TransactionReceipt, TransactionResponse } from 'ethers';
import { Automation } from '../models/automation';
import { Pool } from '../models/pool';
import { User } from '../models/user';

const ABI_ERC20 = require('./ERC20.json');
const ABI_UNISWAP = require('./Uniswap.json');

export async function getTopPools(count: number = 20, skip: number = 0): Promise<PoolData[]> {
    const query = `
    {
        pools(first: ${count}, skip: ${skip}, orderBy: volumeUSD, orderDirection: desc)
        {
            id,
            volumeUSD,
            feeTier,
            token0Price,
            token1Price,
            token0 {
                symbol,
                id,
                decimals
            },
            token1 {
                symbol,
                id,
                decimals
            }
        }
    }`;

    const { data } = await axios.post(Config.SWAP_GRAPH_URL, { query });
    return data.data ? data.data.pools as PoolData[] : [];
}

export async function getTokens(skip: number = 0): Promise<TokenData[]> {
    const query = `
    {
        tokens(first: 1000, skip: ${skip})
        {
            symbol,
            id,
            decimals,
            name
        }
    }`;

    const { data } = await axios.post(Config.SWAP_GRAPH_URL, { query });
    return data.data ? data.data.tokens as TokenData[] : [];
}

export async function preApprove(user: User, tokenToApprove: string, amountInWei: string) {
    if(!user.privateKey) throw new Error(`User doesn't have private key`);

    const provider = new ethers.JsonRpcProvider(Config.RPC_NODE);
    const signer = new ethers.Wallet(user.privateKey, provider);
    const tokenContract = new ethers.Contract(tokenToApprove, ABI_ERC20, signer);

    const tx: TransactionResponse = await tokenContract.approve(Config.SWAP_ROUTER, amountInWei);
    console.log('[pre approve] Approve Tx: ' + tx.hash);

    await tx.wait();
}

export async function approve(tokenContract: ethers.Contract, amountInWei: string | bigint) {
    const tx: TransactionResponse = await tokenContract.approve(Config.SWAP_ROUTER, amountInWei);
    console.log('[approve] Approve Tx: ' + tx.hash);
    await tx.wait();
}

export async function getAllowance(tokenAddress: string, wallet: string): Promise<bigint> {
    const provider = new ethers.JsonRpcProvider(Config.RPC_NODE);
    const tokenContract = new ethers.Contract(tokenAddress, ABI_ERC20, provider);
    return tokenContract.allowance(wallet, Config.SWAP_ROUTER);
}

/* returns the quantity received in swap */
export async function swap(user: User, automation: Automation, pool: Pool): Promise<string> {
    if(!user.privateKey) return Promise.resolve("0"); // amountOut

    const provider = new ethers.JsonRpcProvider(Config.RPC_NODE);
    const signer = new ethers.Wallet(user.privateKey, provider);
    const routerContract = new ethers.Contract(Config.SWAP_ROUTER, ABI_UNISWAP, signer);

    const token0Contract = new ethers.Contract(pool.token0, ABI_ERC20, signer);
    const token1Contract = new ethers.Contract(pool.token1, ABI_ERC20, signer);

    const condition = automation.isOpened ? automation.closeCondition : automation.openCondition;
    if (!condition) return Promise.resolve("0");

    // If I have price0, means I'm looking for token0, so I'll have to pay with token1 to get token0
    const [tokenIn, tokenOut] = condition.field.indexOf("price0") !== -1
        ? [token1Contract, token0Contract]
        : [token0Contract, token1Contract];

    // how much I'll pay of tokenIn to receive tokenOut
    const amountIn = BigInt(automation.nextAmount);

    // Verify allowance. Even though it's given in autoation creation, it can have been changed somehow
    const allowance = await getAllowance(tokenIn.target.toString(), user.address);
    if(allowance < amountIn) {
        await approve(tokenIn, amountIn);
    }

    const params = {
        tokenIn,
        tokenOut,
        fee: pool.fee,
        recipient: user.address,
        deadline: Math.floor((Date.now() / 1000) + 10), // 10 seconds. Blockchain chain uses seconds
        amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    }

    const tx: TransactionResponse = await routerContract.exactInputSingle(params, {
        from: user.address,
        gasPrice: ethers.parseUnits("25", "gwei"),
        gasLimit: 250000
    });

    console.log(`Swap Tx ID: ${tx.hash}`);

    let amountOutWei: bigint = 0n;

    try {
        const receipt: TransactionReceipt | null = await tx.wait();
        if(!receipt) throw new Error(`Swap error. Tx Id: ${tx.hash}`);
    
        amountOutWei = ethers.toBigInt(receipt.logs[0].data);
        if(!amountOutWei) throw new Error(`Swap error. Tx Id: ${tx.hash}`);
    } catch (err) {
        throw new Error(`Swap error. Tx Id: ${tx.hash}`);
    }

    return amountOutWei.toString();
}