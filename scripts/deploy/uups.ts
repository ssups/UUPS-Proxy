import { ethers, upgrades } from "hardhat";

const INIT_MINT_AMOUNT = 100_000_000;

async function main() {
  const factory = await ethers.getContractFactory("TestTokenV1");
  const proxyContract = await upgrades.deployProxy(factory, [INIT_MINT_AMOUNT], {
    kind: "uups",
    initializer: "init",
    verifySourceCode: true,
  });
  await proxyContract.waitForDeployment();

  console.log("uups proxy deployed at: ", await proxyContract.getAddress());

  const version = await proxyContract.version();
  console.log("version: ", version);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
