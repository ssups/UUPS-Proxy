import { ethers, upgrades } from "hardhat";
import { ERC1967UpgradeUpgradeable__factory } from "../../typechain-types";

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

  const proxyDeploymentTx = proxyContract.deploymentTransaction();
  if (proxyDeploymentTx) {
    // proxy 컨트렉트 배포와 init(implement)이 한 트렌젝션에서 실행되기때문에 이벤트로 감지하는게 불가능하다.
    const iface = new ethers.Interface(ERC1967UpgradeUpgradeable__factory.abi);
    const receipt = await ethers.provider.getTransactionReceipt(proxyDeploymentTx.hash);
    receipt?.logs.forEach((log, ind) => {
      const parsedLog = iface.parseLog({ topics: [...log.topics], data: log.data });
      // console.log(`log${ind}: `, parsedLog);
      if (parsedLog?.name == "Upgraded") {
        const implementation = parsedLog.args[0];
        console.log("implement contract: ", implementation);
      }
    });
  } else {
    throw new Error("");
  }

  const rollbackImplement = ethers.getAddress(
    "0x" +
      (
        await ethers.provider.getStorage(
          await proxyContract.getAddress(),
          "0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143"
        )
      ).slice(-40)
  );
  console.log("rollback implementation", rollbackImplement);

  const version = await proxyContract.version();
  console.log("version: ", version.toString());
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
