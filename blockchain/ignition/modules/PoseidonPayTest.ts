import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const ABI_WETH = require("./abi.weth.json");
const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function depositEth() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const wethContract = new ethers.Contract(WETH_MAINNET, ABI_WETH, signer);
    const tx = await wethContract.deposit({ value: ethers.parseEther("10") });
    await tx.wait();

    console.log("Tx Deposit: " + tx.hash);

    const balance = await wethContract.balanceOf(WALLET);
    console.log(`WETH balance: ${ethers.formatEther(balance)}`);
}

const PoseidonPayModule = buildModule("PoseidonPayModule", (m) => {
  const poseidonPay = m.contract("PoseidonPay", [], {});

  depositEth().then(v => console.log(v));

  return { poseidonPay };
});

export default PoseidonPayModule;