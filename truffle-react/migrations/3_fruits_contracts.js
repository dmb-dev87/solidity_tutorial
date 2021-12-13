var FruitsList = artifacts.require("./Fruits.sol");

module.exports = function(deployer) {
  deployer.deploy(FruitsList);
};