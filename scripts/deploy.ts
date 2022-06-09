import { ethers } from "hardhat";

// Deploys a contract on .env's provided network
// yarn hardhat run --network polygon scripts/deploy.ts

async function main() {
  // We get the contract to deploy
  const Contract = await ethers.getContractFactory("ExampleContract");
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
