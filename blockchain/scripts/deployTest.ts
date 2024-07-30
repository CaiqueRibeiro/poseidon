import { ethers, ignition } from "hardhat";
import PoseidonDeployTest from "../ignition/modules/PoseidonPayTest";
import ABI_WETH from "./abi.weth.json";
import { PoseidonPay } from "../typechain-types";

/*
    Using this script to deploy because could not find a way to deposit eth
    in WETH forked contract through ignition
*/

const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const wethContract = new ethers.Contract(WETH_MAINNET, ABI_WETH, signer);

async function depositEth() {
    const tx = await wethContract.deposit({ value: ethers.parseEther("10") });
    await tx.wait();

    console.log("Tx Deposit: " + tx.hash);

    const balance = await wethContract.balanceOf(WALLET);
    console.log(`WETH balance: ${ethers.formatEther(balance)}`);
}

async function payFirstMonth(poseidonPay: PoseidonPay) {
    await wethContract.approve(poseidonPay.target, ethers.parseEther('1'));
    await poseidonPay.pay(WALLET);
    console.log('Account 0 paid');
}

async function main() {
    console.log('Initializing Poseidon deploy');
    const { poseidonPay } = await ignition.deploy(PoseidonDeployTest);
    const contract: PoseidonPay = poseidonPay as any;
    await contract.setAcceptedToken(WETH_MAINNET);
    await depositEth();
    await payFirstMonth(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});