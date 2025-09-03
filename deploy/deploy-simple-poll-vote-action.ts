import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { StorageClient, immutable } from "@lens-chain/storage-client";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const ACTION_HUB_ADDRESS =
    hre.network.name === "lensTestnet"
      ? "0x4A92a97Ff3a3604410945ae8CA25df4fBB2fDC11" // Lens Testnet ActionHub
      : "0xc6d57ee750ef2ee017a9e985a0c4198bed16a802"; // Lens Mainnet ActionHub

  // Upload metadata to Grove
  console.log("Uploading metadata to Grove...");

  const storageClient = StorageClient.create();

  const metadata = {
    "$schema": "https://json-schemas.lens.dev/actions/1.0.0.json",
    "lens": {
      "id": "3797af6b-f858-45aa-bb25-d745f32a128d",
      "name": "SimplePollVoteAction",
      "description": "Allows users to cast simple boolean votes (yes/no) on a post with single-vote enforcement. Prevents double voting.",
      "authors": [
        "barto@avara.xyz"
      ],
      "source": "https://github.com/lens-protocol/lens-network-hardhat-boilerplate",
      "executeParams": [
        {
          "key": "0xf1d961d1860db912f7c57ff7ec8e742cb92089b269e42c6fba52c85bcbdf21d8",
          "name": "lens.param.vote",
          "type": "bool"
        }
      ]
    }
  };

  const chainId = hre.network.name === "lensMainnet" ? 232 : 37111;

  const resource = await storageClient.uploadAsJson(metadata, {
    acl: immutable(chainId)
  });

  console.log(`Metadata uploaded to Grove: ${resource.uri}`);

  await deployContract("SimplePollVoteAction", [ACTION_HUB_ADDRESS, wallet.address, resource.uri], {
    hre,
    wallet,
    verify: true,
  });
}
