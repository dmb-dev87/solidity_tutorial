const ethers = require('ethers');
const abi = require('../artifacts/contracts/Greeter.sol/Greeter.json').abi;
const dotenv = require('dotenv');

dotenv.config();
const provider = new ethers.ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(process.env.WALLET_ADDRESS || 'UNKNOWN_WALLET_ADDRESS');
const contract = new ethers.ethers.Contract(process.env.CONTRACT_ADDRESS || 'UNKNOWN_CONTRACT_ADDRESS', abi, signer);

const init = async () => {
  try {
    const result = await contract.greet();
    console.log({ result });

    const transaction = await contract.setGreeting('Hello from docker!');
    console.log({ transaction });

    transaction.wait();
    console.log({ result: await contract.greet() });
  } catch (error) {
    console.log({ error });
  }
}

init();