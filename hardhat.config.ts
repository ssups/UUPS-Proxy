import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
dotenv.config();

const env = {
  sepolia: {
    pkList: [process.env.SEPOLIA_PK || ""],
    apiKey: process.env.SEPOLIA_API || "",
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
  },
  etherscan: {
    apiKey: env.etherscan.apiKey,
  },
};

export default config;
