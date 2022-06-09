import { erc20Address } from './../utils/index';
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { spawnToken } from "../utils";
import { BigNumber } from 'ethers';

describe("ExampleContract", function () {
  let DeployedContract: any;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async () => {
    // Set up wallets
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    const contract = await ethers.getContractFactory("ExampleContract")
    DeployedContract = await contract.connect(owner).deploy()
  })

  it("doSomething: Expect valid output value", async () => {
    // Test contract function
    const result: string = await DeployedContract.doSomething(addr1.address)
    expect(result).to.eq(addr1.address)
  })

  it("Demo utilies", async () => {
    // Get wallet with a token
    await spawnToken(erc20Address.USDC, BigNumber.from("10000000"), addr1)
  })
})
