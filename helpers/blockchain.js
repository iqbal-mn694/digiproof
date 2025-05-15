require('dotenv').config();

const { Web3 } = require('web3');
const fs = require('fs');
const abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));

async function main() {
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

  // transaction
  // const method_abi = contract.methods.issueCertificate('0xd74bd4d60851b165c5a70a2d0c81480ae0424122440c621ec1e63ab3f1c9b321', "Asep", "Basis Data").encodeABI()
  // const tx = {
  //   from: signer.address,
  //   to: contract.options.address,
  //   data: method_abi,
  //   value: "0",
  //   gasPrice: "100000000",
  // }
  // const gas_estimate = await web3.eth.estimateGas(tx)
  // tx.gas = gas_estimate
  // const signedTx = await web3.eth.accounts.signTransaction(
  //   tx,
  //   signer.privateKey
  // )
  // console.log("Raw transaction data: " + signedTx.rawTransaction)
  // // Sending the transaction to the network
  // const receipt = await web3.eth
  //   .sendSignedTransaction(signedTx.rawTransaction)
  //   .once("transactionHash", (txhash) => {
  //     console.log(`Mining transaction ...`)
  //     console.log(`https://${network}.etherscan.io/tx/${txhash}`)
  //   })
  // // The transaction is now on chain!
  // console.log(`Mined in block ${receipt.blockNumber}`)


  // verify hash from blockchain
  const result = await contract.methods.verifyCertificate('0xd74bd4d60851b165c5a70a2d0c81480ae0424122440c621ec1e63ab3f1c9b321').call();
  console.log(result)

}

main()