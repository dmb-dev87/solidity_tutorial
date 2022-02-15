// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SmartChef = await hre.ethers.getContractFactory("SmartChefInitializable");
  const smartChef = await SmartChef.deploy();
  await smartChef.deployed();
  console.log("SmartChef deployed to:", smartChef.address);

  const StakedToken = await hre.ethers.getContractFactory("Token");
  const stakedToken = await StakedToken.deploy("Staked Test Token", "STT");
  await stakedToken.deployed();
  console.log("StakedToken deployed to:", stakedToken.address);

  const RewardToken = await hre.ethers.getContractFactory("Token");
  const rewardToken = await RewardToken.deploy("Reward Test Token", "RTT");
  await rewardToken.deployed();
  console.log("RewardToken deployed to:", rewardToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
