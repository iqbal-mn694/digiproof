const fs = require('fs');
const crypto = require('crypto');


const privateKey = fs.readFileSync('keys/private.pem', 'utf-8');
const publicKey = fs.readFileSync('keys/public.pem', 'utf-8');

// generate hash from document
function createHash(pdf){
  return crypto.createHash('sha256').update(pdf).digest('hex');
}

function signDocument(pdfPath) {
  const pdf = fs.readFileSync(pdfPath);

  // call hash function to generate hash
  const hash = createHash(pdf)
  
  // sign hash with the private key
  const signature = crypto.sign('sha256',  Buffer.from(hash), privateKey).toString('hex');
  
  return { hash, signature }
}

function verifyDocument(pdfBuffer, signature) {
  // call hash function to recalculate hash document
  const hash = createHash(pdfBuffer);

  // verify signature
  const isValid = crypto.verify('sha256', Buffer.from(hash), publicKey, Buffer.from(signature, 'hex'));

  // check signature is valid
  return isValid ? "Valid Signature!" : "Signature is not valid";
}

module.exports = { signDocument, verifyDocument }