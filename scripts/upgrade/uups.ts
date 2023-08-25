import { ethers, upgrades } from "hardhat";

const preProxyCA = "0x81C86b9137f3D525516B24185dfbd2c48B4BC109";

async function main() {
  const provider = ethers.provider;
  const callldata = ethers.keccak256(ethers.toUtf8Bytes("owner()")).slice(0, 10);
  const ownerAddress = await provider.call({ to: preProxyCA, data: callldata });
  console.log(ownerAddress);

  return;
  const [owner] = await ethers.getSigners();
  const newFactory = await ethers.getContractFactory("TestTokenV2", owner);
  const proxyV2 = await upgrades.upgradeProxy(preProxyCA, newFactory, { kind: "uups" });
  await proxyV2.waitForDeployment();

  const version = await proxyV2.version();
  console.log("version: ", version);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
