const fs = require('fs');
const { signAndSendTransaction, verifyCertificate } = require("../libs/blockchain");
const { signDocument, verifyDocument } = require("../libs/pdfSigner");
const { generatePDF } = require("../libs/pdfgenerator");
const { IjazahHTML } = require('../html/IjazahHTML');

const p12Buffer = fs.readFileSync('keys/certificate.p12');
const passphrase = process.env.PASSPHRASE;

exports.home = (req, res)=> {
  res.render('index');
}

exports.generate = (req, res)=> {
  res.render('generate');
}

exports.verify = (req, res) => {
  res.render('verify');
  
}

exports.generateSignedDocument = async (req, res) => {
  const university_address = 'Jln.Raya Mugar No.3 Tasikmalaya'
  const ijazah_data = {
    university_address,
    ...req.body
  }

  // generate pdf from HTML code
  const HTML = IjazahHTML(ijazah_data)
  const pdfBuffer = await generatePDF(HTML);

  // sign document
  const signedPDFPath = `/documents/Ijazah_${ijazah_data.student_name}_${ijazah_data.npm}.pdf`
  const { hash, signature } = signDocument(pdfBuffer, p12Buffer, passphrase, signedPDFPath);

  // send to blockchain
  const blockchain = await signAndSendTransaction(hash, ijazah_data.student_name, ijazah_data.npm);

  res.json({  hash, ijazah_data, ijazah_path: signedPDFPath, blockchain });
}

exports.verifyingSignedDocument = async(req, res) => {
  const pdfBuffer = req.file.buffer;

  // verify signature
  const { certificate, valid, hash } = verifyDocument(pdfBuffer);
  const { subject } = certificate;
  const { attributes } = subject;

  // verify on blockchain
  const verifiedCertificate = await verifyCertificate(hash);

  res.json({ message: "Ijazah Valid", sign_valid_status: valid === true ? "Valid" : "Invalid", attributes , hash, blockchain: verifiedCertificate });
}