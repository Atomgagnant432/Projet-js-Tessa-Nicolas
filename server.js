require('dotenv').config();
const express = require('express');
const session = require('express-session')
const app = express();
const authRoutes = require('./src/routes/routeauth');

app.use(express.json());
app.use(express.static('src/LoginPage'));

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

app.listen(3030, () => console.log('Serveur lancé sur http://localhost:3030'));