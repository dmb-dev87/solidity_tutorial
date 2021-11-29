const hre = require("hardhat");

async function main() {
  const ERC20 = await hre.ethers.getContractFactory("MinamiDollar");
  const erc20 = await ERC20.deploy();

  await erc20.deployed();

  console.log("ERC20 deployed to: ", erc20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });