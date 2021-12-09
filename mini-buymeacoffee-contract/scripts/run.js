// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const coffeeContractFactory = await hre.ethers.getContractFactory("CoffeePortal");
  const coffeeContract = await coffeeContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  await coffeeContract.deployed();
  console.log("Coffee Contract deployed to:", coffeeContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    coffeeContract.address
  );

  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  const coffeeTxn = await coffeeContract.buyCoffee(
    "This is coffee #1",
    "idris",
    ethers.utils.parseEther("0.001")
  );

  await coffeeTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(coffeeTxn.address);

  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  let allCoffee = await coffeeContract.getAllCoffee();
  console.log(allCoffee);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();