import axios from 'axios';
import Config from '../configBase';
import { PoolData, TokenData } from './uniswapTypes';
import { User } from '../models/user';
import { ethers, TransactionResponse } from 'ethers';
import * as ABI_ERC20 from './ERC20.json';

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

export async function preApprove(user: User, tokenToApprove: string, amountInEth: string) {
    if(!user.privateKey) throw new Error(`User doesn't have private key`);

    const provider = new ethers.JsonRpcProvider(Config.RPC_NODE);
    const signer = new ethers.Wallet(user.privateKey, provider);
    const tokenContract = new ethers.Contract(tokenToApprove, ABI_ERC20, signer);

    const tx: TransactionResponse = await tokenContract.approve(Config.SWAP_ROUTER, ethers.parseEther(amountInEth));
    console.log('Approve Tx: ' + tx.hash);

    await tx.wait();
}

export async function approve(tokenContract: ethers.Contract, amountInWei: string | bigint) {
    const tx: TransactionResponse = await tokenContract.approve(Config.SWAP_ROUTER, amountInWei);
    console.log('Approve Tx: ' + tx.hash);
    await tx.wait();
}

export async function getAllowance(tokenAddress: string, wallet: string): Promise<bigint> {
    const provider = new ethers.JsonRpcProvider(Config.RPC_NODE);
    const tokenContract = new ethers.Contract(tokenAddress, ABI_ERC20, provider);
    return tokenContract.allowance(wallet, Config.SWAP_ROUTER);
}