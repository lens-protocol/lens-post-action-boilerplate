import "@matterlabs/hardhat-zksync";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
  },
  zksolc: {
    version: "1.5.12",
    settings: {
      codegen: "yul",
    },
  },
  networks: {
    lensTestnet: {
      chainId: 37111,
      ethNetwork: "sepolia",
      url: "https://rpc.testnet.lens.xyz",
      verifyURL:
        "https://block-explorer-verify.testnet.lens.xyz/contract_verification",
      zksync: true,
    },
    lensMainnet: {
      chainId: 232,
      ethNetwork: "sepolia",
      url: "https://rpc.lens.xyz",
      verifyURL:
        "https://verify.lens.xyz/contract_verification",
      zksync: true,
    },
    hardhat: {
      zksync: true,
      loggingEnabled: true,
    },
  },
};

export default config;
