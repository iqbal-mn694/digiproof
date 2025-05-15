const crypto = require('crypto');
const { writeFileSync } = require('fs');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

writeFileSync('public.pem', publicKey);
writeFileSync('private.pem', privateKey);

console.log('Public and private key generated');