import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
dotenv.config();

const env = {
  sepolia: {
    apiKey: process.env.SEPOLIA_API || "",
    pkList: [process.env.SEPOLIA_PK1 || "", process.env.SEPOLIA_PK2 || ""],
  },
  dev: {
    end_point: process.env.GND_DEV_END_POINT || "",
    pkList: [process.env.GND_DEV_PK1 || "", process.env.GND_DEV_PK2 || ""],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API || "",
  },
};

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${env.sepolia.apiKey}`,
      accounts: env.sepolia.pkList,
    },
    dev: {
      url: "http://hq.gnd.devnet.kstadium.io:8545",
      accounts: env.dev.pkList,
      gasPrice: 800 * 1e9,
    },
  },
  etherscan: {
    apiKey: env.etherscan.apiKey,
  },
};

export default config;
