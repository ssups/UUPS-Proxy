import { ethers, upgrades } from "hardhat";

const preProxyCA = "0x948c115DF84418E3407D6E35348766524F5d62D3";

async function main() {
  const newFactory = await ethers.getContractFactory("TestTokenV2");
  const proxyV2 = await upgrades.upgradeProxy(preProxyCA, newFactory, { kind: "uups" });
  await proxyV2.waitForDeployment();

  const version = await proxyV2.version();
  console.log("version: ", version);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
