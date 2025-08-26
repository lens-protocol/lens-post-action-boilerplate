import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const ACTION_HUB_ADDRESS =
    hre.network.name === "lensTestnet"
      ? "0x4A92a97Ff3a3604410945ae8CA25df4fBB2fDC11" // Lens Testnet ActionHub
      : "0xc6d57ee750ef2ee017a9e985a0c4198bed16a802"; // Lens Mainnet ActionHub

  await deployContract("SimplePollVoteAction", [ACTION_HUB_ADDRESS, wallet.address], {
    hre,
    wallet,
    verify: true,
  });
}
