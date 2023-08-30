import { ethers, upgrades } from "hardhat";

const PROXY_CA = "0xF95E486b30dCF9a37ad09016413B5CCa1F127CDB";

async function main() {
  const factory = await ethers.getContractFactory("TestTokenV3");
  const upgradedProxy = await upgrades.upgradeProxy(PROXY_CA, factory, { kind: "uups" });

  upgradedProxy.once("Upgraded", async (implementation) => {
    console.log("new implementation: ", implementation);
    const version = await upgradedProxy.version(); // call for check has to be done after upgrade tx
    console.log("version: ", version.toString());
    const rollbackImplement = ethers.getAddress(
      "0x" +
        (
          await ethers.provider.getStorage(
            PROXY_CA,
            "0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143"
          )
        ).slice(-40)
    );

    console.log("rollback implementation", rollbackImplement);
  });
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
