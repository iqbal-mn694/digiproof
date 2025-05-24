const fs = require('fs');
const forge = require('node-forge');
const { plainAddPlaceholder } = require('node-signpdf/dist/helpers');
const { default: signer } = require('node-signpdf');
const { extractSignedDataAndSignature, calculateDigest } = require('../helpers/customCrypto');

function signDocument(pdfOriginalBuffer, p12Buffer, passphrase, signedPDFPath) {
  
  const pdfPlaceholder = plainAddPlaceholder({ pdfBuffer: pdfOriginalBuffer})

  const signedPDF = signer.sign(pdfPlaceholder, p12Buffer,{
    passphrase
  });

  // get hash original data part
  const { signedData } = extractSignedDataAndSignature(signedPDF);
  const { hash } = calculateDigest(signedData, 'sha256');

  // write signed pdf to documents folder
  signedPDFPath = `public/${signedPDFPath}`
  fs.writeFileSync(signedPDFPath, signedPDF);
  
  return { hash, signature: signedPDF }
}


// Parse dan verifikasi signature
function verifySignature(signatureBuffer, signedDataDigest) {
  const p7Asn1 = forge.asn1.fromDer(forge.util.createBuffer(signatureBuffer.toString('binary')), false);
  const message = forge.pkcs7.messageFromAsn1(p7Asn1, false);

  if (!message.certificates || message.certificates.length === 0) {
    throw new Error('Tidak ada sertifikat ditemukan');
  }

  const signer = message.rawCapture;
  const digestAttr = signer.authenticatedAttributes.find(attr =>
    forge.asn1.derToOid(attr.value[0].value) === forge.pki.oids.messageDigest
  );

  const embeddedDigest = digestAttr.value[1].value[0].value;

  const embeddedDigestBytes = forge.util.createBuffer(embeddedDigest).getBytes();
  const actualDigestBytes = forge.util.createBuffer(signedDataDigest).getBytes();

  const digestMatch = embeddedDigestBytes === actualDigestBytes;

  return {
    digestMatch,
    certificate: message.certificates[0],
    valid: digestMatch // simple validation
  };
}

function verifyDocument(pdfBuffer) {
  const { signedData, signature } = extractSignedDataAndSignature(pdfBuffer);
  const { digest, hash } = calculateDigest(signedData, 'sha256');
  const { certificate, digestMatch, valid} = verifySignature(signature, digest);

  return { certificate, digestMatch, valid, hash };
}

module.exports = { signDocument, verifyDocument }



