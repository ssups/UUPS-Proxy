import { ethers, upgrades } from "hardhat";

const PROXY_CA = "0x7B1c9996a68a76eaaE4D762B93726BFce84edB76";

async function main() {
  const newFactory = await ethers.getContractFactory("TestTokenV2");
  const upgradedProxy = await upgrades.upgradeProxy(PROXY_CA, newFactory, { kind: "uups" });

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
