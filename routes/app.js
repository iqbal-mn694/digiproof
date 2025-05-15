const express = require('express');
const router = express.Router();

const { home, generateSignedDocument, verifyingSignedDocument } = require('../controllers/main');

router.get('/', home);

// generate signed document
router.post('/generate-document', generateSignedDocument);

// verifying signed document
router.post('/verify-document', verifyingSignedDocument);

module.exports = router;

