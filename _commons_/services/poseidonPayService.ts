import { ethers } from "ethers";
import {abi as ABI} from "./PoseidonPay.json";
import ConfigBase from "../configBase";

function getProvider(): ethers.InfuraProvider {
    return new ethers.InfuraProvider(ConfigBase.INFURA_NETWORK, ConfigBase.INFURA_API_KEY);
}

function getContract(): ethers.Contract {
    const provider = getProvider();
    return new ethers.Contract(ConfigBase.POSEIDON_PAY_CONTRACT, ABI, provider);
}

function getSigner(): ethers.Contract {
    const provider = getProvider();
    const signer = new ethers.Wallet(ConfigBase.ADMIN_PRIVATE_KEY, provider);
    return new ethers.Contract(ConfigBase.POSEIDON_PAY_CONTRACT, ABI, signer);
}

export function getCustomers(): Promise<string[]> {
    return getContract().getCustomers();
}

export function getCustomerNextPayment(customer: string): Promise<number> {
    return getContract().payments();
}

export async function pay(customer: string): Promise<string> {
    const tx: ethers.TransactionResponse = await getSigner().pay(customer);
    await tx.wait();
    return tx.hash;
}