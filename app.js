const express = require('express');
const app = express();
const path = require('path');
const { generate } = require('./controllers/main');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));
app.get('/generate', (req, res) => res.render('generate'));
app.get('/verify', (req, res) => res.render('verify'));

// Placeholder POST routes
app.post('/generate', generate);
app.post('/verify', (req, res) => {
  res.send('Verifikasi logic belum diimplementasi');
});

app.listen(8000, () => console.log('Server running on http://localhost:8000')); 