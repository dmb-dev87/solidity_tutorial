/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

const AVALANCHE_TEST_PRIVATE_KEY = "PRIVATE_KEY_FOR_FIJI";
const AVALANCHE_MAIN_PRIVATE_KEY = "PRIVATE_KEY_FOR_MAINNET";

module.exports = {
  solidity: "0.7.3",
  networks: {
    avalancheTest: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [`0x${AVALANCHE_TEST_PRIVATE_KEY}`]
    },
    avalancheMian: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [`0x${AVALANCHE_MAIN_PRIVATE_KEY}`]
    }
  }
};
