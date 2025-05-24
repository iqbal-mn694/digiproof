const crypto = require('crypto');

function extractSignedDataAndSignature(pdfBuffer) {
  const pdfText = pdfBuffer.toString('latin1');
  const byteRangeMatch = pdfText.match(/\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/);
  if (!byteRangeMatch) throw new Error('ByteRange tidak ditemukan');

  const [start1, length1, start2, length2] = byteRangeMatch.slice(1).map(Number);
  const signedData = Buffer.concat([
    pdfBuffer.slice(start1, start1 + length1),
    pdfBuffer.slice(start2, start2 + length2),
  ]);

  const signatureStart = start1 + length1;
  const signatureEnd = start2;
  const signatureRaw = pdfBuffer.slice(signatureStart, signatureEnd);

  const cleanedHex = signatureRaw.toString('latin1')
    .replace(/[^0-9A-Fa-f]/g, '')
    .replace(/(00)+$/, '');

  if (cleanedHex.length % 2 !== 0) {
    throw new Error('Signature hex ganjil atau rusak');
  }

  const signatureBuffer = Buffer.from(cleanedHex, 'hex');

  return { signedData, signature: signatureBuffer };
}

function calculateDigest(buffer, algorithm = 'sha256') {
  const digest = crypto.createHash(algorithm).update(buffer).digest();
  const hash = crypto.createHash(algorithm).update(buffer).digest('hex');
  return { digest, hash }
}

module.exports = { extractSignedDataAndSignature, calculateDigest }