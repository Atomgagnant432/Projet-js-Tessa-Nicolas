require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session')
const app = express();
const authRoutes = require('./src/routes/routeauth');

app.use(express.json());

// Sert toutes les pages statiques (LoginPage, HomePage, Shared, etc.)
app.use(express.static(path.join(__dirname, 'src')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Page par défaut
app.get('/', (req, res) => {
  res.redirect('/LoginPage/index.html');
});

app.use(session({
  secret: 'netflixlight_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 24h
  }
}));

app.use('/api/auth', authRoutes);

// Front (HomePage/search.js + movie.js) attend /api/config
app.get('/api/config', (req, res) => {
  res.json({ tmdbKey: process.env.Jeton_tmdb || process.env.TMDB_API_KEY || "" });
});

app.listen(3030, () => console.log('Serveur lancé sur http://localhost:3030'));
