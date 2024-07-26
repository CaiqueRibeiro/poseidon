import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ignition } from "hardhat";

const PoseidonPayModule = buildModule("PoseidonPayModule", (m) => {
  const poseidonPay = m.contract("PoseidonPay", [], {});

  return { poseidonPay };
});

export default PoseidonPayModule;