require('dotenv');
const express = require('express');

const PORT = 8000 || process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/****** ROUTES ******/ 
app.use('/', require('./routes/app'));

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})