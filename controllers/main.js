const { signDocument, verifyDocument } = require("../helpers/digitalSignature");

exports.home = (req, res)=> {
  res.send("Hello world")
}

exports.generateSignedDocument = (req, res) => {
  const { name, course } = req.body;
  const document = `${name} | ${course}`

  // sign document
  const { signature, hash } = signDocument(document);

  res.json({ signature, hash });
}

exports.verifyingSignedDocument = (req, res) => {
  const { name, course, signature } = req.body;
  const document = `${name} | ${course}`;

  const signedDocument = verifyDocument(document, signature);
  res.json({ signedDocument });
}