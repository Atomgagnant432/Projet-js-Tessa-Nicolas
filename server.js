require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('src/HomePage')); 

// Route qui expose la clé au front
app.get('/api/config', (req, res) => {
    res.json({ tmdbKey: process.env.Jeton_tmdb });
});

app.listen(3030, () => console.log('Serveur lancé sur http://localhost:3030'));