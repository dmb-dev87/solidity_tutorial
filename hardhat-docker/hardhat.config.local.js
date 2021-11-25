require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const { task } = require("hardhat/config");

task("my-deploy", "Deploys contract, get wallets, and output files", async (taskArgs, hre) => {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  const contractAddress = greeter.address;

  fs.writeFileSync('./.contract', contractAddress);

  const accounts = await hre.ethers.getSigners();

  const walletAddress = accounts[0].address;

  fs.writeFileSync('./.wallet', walletAddress);
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};
