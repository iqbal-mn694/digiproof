const { signAndSendTransaction, verifyCertificate } = require("../helpers/blockchain");
const { signDocument, verifyDocument } = require("../helpers/digitalSignature");
const { generatePDF } = require("../helpers/pdfgenerator");

exports.home = (req, res)=> {
  res.send("Hello world")
}

exports.generateSignedDocument = async (req, res) => {
  const { name, course } = req.body;
  // const document = `${name} | ${course}`

  const pdfPath = await generatePDF(name);
  // sign document
  const { signature, hash } = signDocument(pdfPath);

  // send to blockchain
  const { raw_transaction, block } = await signAndSendTransaction(hash, name, course)

  // generate pdf
  // res.json({ signature, hash, pdfPath });
  res.json({ signature, hash, raw_transaction, block, message: pdfPath });
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