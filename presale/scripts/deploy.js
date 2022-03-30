const hre = require("hardhat");

async function main() {
  const Presale = await hre.ethers.getContractFactory("PresaleToken");
  const presale = await Presale.deploy("0xc84128337C888E2eBC7979fC9c83955A6FC29435");

  await presale.deployed();

  console.log("Presale deployed to:", presale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
