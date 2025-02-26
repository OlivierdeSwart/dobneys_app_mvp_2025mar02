import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem"; // ✅ Viem-based toolbox
import "@nomicfoundation/hardhat-viem"; // ✅ Required for hre.viem
import "dotenv/config"; 


const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.SEED_PHRASE,
      },
      chainId: 1337,
    },
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL || "",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // },
  },
};

export default config;
