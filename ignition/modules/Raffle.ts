import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RaffleModule", (m) => {
  const raffle = m.contract("Raffle");

  return { raffle };
});