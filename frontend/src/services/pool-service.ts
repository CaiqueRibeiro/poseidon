import axios from '@/services/base-service';
import ConfigService from './config-service';
import { Pool } from 'commons/models/pool';

const BACKEND_URL = `${ConfigService.BACKEND_URL}/pools`;

export async function getPool(identifier: string): Promise<Pool> {
    const response = await axios.get(`${BACKEND_URL}/${identifier}`);
    return response.data;
}

export async function searchPool(symbol: string, fee: number): Promise<Pool> {
    const response = await axios.get(`${BACKEND_URL}/${symbol}/${fee}`);
    return response.data;
}

export async function getPools(page: number = 1, pageSize: number = 20): Promise<Pool[]> {
    const response = await axios.get(`${BACKEND_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data;
}

export async function getTopPools(): Promise<Pool[]> {
    const response = await axios.get(`${BACKEND_URL}/top`);
    return response.data;
}

export async function getPoolSymbols(): Promise<string[]> {
    const response = await axios.get(`${BACKEND_URL}/symbols`);
    return response.data;
}