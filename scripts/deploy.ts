import { network } from "hardhat";
import { parseEther } from "viem";

async function main() {
  const { viem } = await network.connect({
    network: "arbitrumSepolia",
    chainType: "generic",   // ★ Arbitrum은 generic chain type 사용
  });

  const publicClient = await viem.getPublicClient();
  const [walletClient] = await viem.getWalletClients();

  console.log("Deploying contract...");

  // ★ constructor(uint _entryFee) 인자 추가
  const entryFee = parseEther("0.0001");  // 0.001 ETH

  const contract = await viem.deployContract("Raffle", [entryFee]);

  console.log("Raffle deployed at:", contract.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});