import axios from '@/services/base-service';
import ConfigService from './config-service';
import { Trade } from 'commons/models/trade';

const BACKEND_URL = `${ConfigService.BACKEND_URL}/trades/closed`;

export async function getAutomations(dateFrom: Date, dateTo: Date = new Date()): Promise<Trade[]> {
    const response = await axios.get(`${BACKEND_URL}?dateFrom=${+ dateFrom}&dateTo=${+ dateTo}`);
    return response.data as Trade[];
}