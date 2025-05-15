require('dotenv').config();

const { Web3 } = require('web3');
const fs = require('fs');
const abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));

async function web3Configuration() {
  const network = process.env.RPC_URL;

  // connection to blockchain network
  const web3 = new Web3(
    new Web3.providers.HttpProvider(network)
  );
  
  // sign in to wallet account
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);

  // contract instance
  const contract = new web3.eth.Contract(
    abi, process.env.CONTRACT_ADDRESS
  );

  return { web3, signer, contract, network };
}

async function transactionSigner(hash, name, course) {
  const { web3, signer, contract, network } = await web3Configuration();
  const certHash = '0x' + hash;

  // store to the blockchain
  const method_abi = contract
    .methods
    .issueCertificate(certHash, name, course)
    .encodeABI();
  
  // get gas price
  const gasPrice = await web3.eth.getGasPrice();

  // transaction information
  const tx = {
    from: signer.address,
    to: contract.options.address,
    data: method_abi,
    value: "0",
    gasPrice: gasPrice,
  }

  // estimate gas
  const gasEstimate = await web3
    .eth
    .estimateGas(tx);

  tx.gas = gasEstimate;

  // sign to wallet account
  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    signer.privateKey
  )

  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`)
      console.log(`https://${network}.etherscan.io/tx/${txhash}`)
    })

    return {
      raw_transaction: signedTx.rawTransaction,
      block: receipt.blockNumber.toString(),  // The transaction is now on chain!
    }
}

// verify certificate
async function verifyCertificate(hash) {
  const { contract } = await web3Configuration();

  // verify hash from blockchain
  const certHash ="0x" + hash
  const result = await contract.methods.verifyCertificate(certHash).call();
  console.log(result)
}

module.exports = { transactionSigner, verifyCertificate };