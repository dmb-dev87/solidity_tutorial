const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("Token");
  token = await Token.deploy("Token", "TNK", (10 ** 18).toString());
  await token.deployed();

  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(token.address);

  await exchange.deployed();

  console.log("Exchange deployed to:", exchange.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });