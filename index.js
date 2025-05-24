require('dotenv');
const express = require('express');
const path = require('path');

const PORT = 8000 || process.env.PORT;

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/****** ROUTES ******/ 
app.use('/', require('./routes/app'));

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})