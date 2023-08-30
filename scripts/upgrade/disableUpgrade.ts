import { ethers } from "hardhat";

const PROXY_CA = "0x70BaAbe2e1dD5C9C6a443fE2c27926796274ED6B";

async function main() {
  const proxyContract = await ethers.getContractAt("TestTokenV2", PROXY_CA);
  const tx = await proxyContract.disableUpgrade();
  await tx.wait();
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
