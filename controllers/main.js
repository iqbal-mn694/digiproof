const { signAndSendTransaction, verifyCertificate } = require("../helpers/blockchain");
const { signDocument, verifyDocument } = require("../helpers/digitalSignature");

exports.home = (req, res)=> {
  res.send("Hello world")
}

exports.generateSignedDocument = async (req, res) => {
  const { name, course } = req.body;
  const document = `${name} | ${course}`

  // sign document
  const { signature, hash } = signDocument(document);

  // send to blockchain
  const { raw_transaction, block } = await signAndSendTransaction(hash, name, course)


  res.json({ signature, hash, raw_transaction, block });
}

exports.verifyingSignedDocument = (req, res) => {
  const { name, course, signature, hash } = req.body;
  const document = `${name} | ${course}`;

  // verify signature
  const signedDocument = verifyDocument(document, signature);

  // verify on blockchain
  const verifiedCertificate = verifyCertificate(hash);
  res.json({ signedDocument, verifiedCertificate });
}