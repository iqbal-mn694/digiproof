const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = multer();

const { home, generateSignedDocument, verifyingSignedDocument, verify, generate } = require('../controllers/main');

router.get('/', home);

router.get('/generate', generate);


router.get('/verify', verify);

// generate signed document
router.post('/generate', generateSignedDocument);

// verifying signed document
router.post('/verify', upload.single('pdf'), verifyingSignedDocument);

module.exports = router;

