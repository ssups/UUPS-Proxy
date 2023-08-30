import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("deploy & upgrade", () => {
  let proxyCA: string;
  let proxyC: Contract;

  before("first deploy", async () => {
    const INIT_MINT_AMOUNT = 100_000_000;
    const factoryV1 = await ethers.getContractFactory("TestTokenV1");
    proxyC = await upgrades.deployProxy(factoryV1, [INIT_MINT_AMOUNT], {
      initializer: "init",
      kind: "uups",
    });
    await proxyC.waitForDeployment();
    proxyCA = await proxyC.getAddress();

    expect(await proxyC.version()).to.eq("1");
  });

  it("upgrade to V2", async () => {
    const factoryV2 = await ethers.getContractFactory("TestTokenV2");
    await upgrades.upgradeProxy(proxyCA, factoryV2, { kind: "uups" });

    expect(await proxyC.version()).to.eq("2");
  });

  it("upgrade to V3(disable upgrade)", async () => {
    const factoryV3 = await ethers.getContractFactory("TestTokenV3");
    await upgrades.upgradeProxy(proxyCA, factoryV3, { kind: "uups" });

    expect(await proxyC.version()).to.eq("3");
  });

  it("try to upgrade V4", async () => {
    const factoryV4 = await ethers.getContractFactory("TestTokenV4");

    // deploy implement contract
    const implementCA = await upgrades.prepareUpgrade(proxyCA, factoryV4, {
      kind: "uups",
    });

    await expect(proxyC.upgradeTo(implementCA)).to.be.revertedWith("upgrade disabled");
  });
});
