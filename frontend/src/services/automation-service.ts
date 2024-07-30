import axios from '@/services/base-service';
import ConfigService from './config-service';
import { Automation } from 'commons/models/automation';

const BACKEND_URL = `${ConfigService.BACKEND_URL}/automations`;

export async function getAutomation(identifier: string): Promise<Automation> {
    const response = await axios.get(`${BACKEND_URL}/${identifier}`);
    return response.data as Automation;
}

export async function getAutomations(page: number = 1, pageSize: number = 10): Promise<Automation[]> {
    const response = await axios.get(`${BACKEND_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data as Automation[];
}

export async function getActiveAutomations(): Promise<Automation[]> {
    const response = await axios.get(`${BACKEND_URL}/active`);
    return response.data as Automation[];
}

export async function getTopAutomations(): Promise<Automation[]> {
    const response = await axios.get(`${BACKEND_URL}/top`);
    return response.data as Automation[];
}

export async function addAutomation(automation: Automation): Promise<Automation> {
    const response = await axios.post(`${BACKEND_URL}/`, automation);
    return response.data as Automation;
}

export async function startAutomation(identifier: string): Promise<Automation> {
    const response = await axios.post(`${BACKEND_URL}/${identifier}/start`);
    return response.data as Automation;
}

export async function stopAutomation(identifier: string): Promise<Automation> {
    const response = await axios.post(`${BACKEND_URL}/${identifier}/stop`);
    return response.data as Automation;
}

export async function updateAutomation(identifier: string, automation: Automation): Promise<Automation> {
    const response = await axios.patch(`${BACKEND_URL}/${identifier}`, automation);
    return response.data as Automation;
}

export async function deleteAutomation(identifier: string): Promise<Automation> {
    const response = await axios.delete(`${BACKEND_URL}/${identifier}`);
    return response.data as Automation;
}
