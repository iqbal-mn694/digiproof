require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');

// Load ABI from file
const abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));

/**
 * Configure Web3 with the blockchain network and account details.
 * @returns {Promise<Object>} An object containing web3 instance, signer, contract, and network.
 */
async function configureWeb3() {
  const network = process.env.RPC_URL;
  const web3 = new Web3(new Web3.providers.HttpProvider(network));
  
  // Retrieve and add account from private key
  const signer = web3.eth.accounts.privateKeyToAccount(`0x${process.env.SIGNER_PRIVATE_KEY}`);
  web3.eth.accounts.wallet.add(signer);

  const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

  return { web3, signer, contract, network };
}

/**
 * Sign and send a transaction to issue a certificate.
 * @param {string} hash - The certificate hash.
 * @param {string} name - The name of the certificate holder.
 * @param {string} course - The course associated with the certificate.
 * @returns {Promise<Object>} The result of the transaction.
 */
async function signAndSendTransaction(hash, name, npm) {
  const { web3, signer, contract, network } = await configureWeb3();
  const certHash = `0x${hash}`;

  const methodABI = contract.methods.issueCertificate(certHash, name, npm).encodeABI();
  const gasPrice = await web3.eth.getGasPrice();
  
  const transaction = {
    from: signer.address,
    to: contract.options.address,
    data: methodABI,
    value: "0",
    gasPrice,
  };

  // Estimate gas for the transaction
  transaction.gas = await web3.eth.estimateGas(transaction);

  // Sign the transaction
  const signedTransaction = await web3.eth.accounts.signTransaction(transaction, signer.privateKey);

  // Send signed transaction to the network
  const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    .once("transactionHash", (txHash) => {
      console.log(`Mining transaction...`);
      console.log(`Etherscan URL: https://sepolia.etherscan.io/tx/${txHash}`);
    });

  return {
    block: receipt.blockNumber.toString(),
    tx_hash: receipt.transactionHash,
    etherscan_url: `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`
  };
}

/**
 * Verify a certificate by its hash.
 * @param {string} hash - The certificate hash.
 * @returns {Promise<void>}
 */
async function verifyCertificate(hash) {
  const { contract } = await configureWeb3(); // web 3 configuration
  const certHash = '0x' + hash; // hash SHA-256 dari PDF yang dilakan digital signature

  const result = await contract.methods
    .verifyCertificate(certHash)
    .call();

  if (!result.exists) {
    return {
      valid: false,
      message: "Ijazah tidak ditemukan di blockchain.",
    };
  }

  return {
    valid: true,
    student_name : result.studentName,
    npm: result.npm,
    timestamp: result.timestamp.toString(),
    etherscan_url: `https://sepolia.etherscan.io/address/${contract.options.address}`
  };
}

// Export functions for external use
module.exports = { signAndSendTransaction, verifyCertificate };