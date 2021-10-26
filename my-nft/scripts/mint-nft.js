require("dotenv").config()

const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x05700a57e00ea40c342592f455e7e99fe865b3e5"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURL) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURL).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          }
          else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    }) 
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe"
)