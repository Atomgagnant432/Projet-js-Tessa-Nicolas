const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

const users = require("./src/model/user.js");

const app = express();

app.use(express.json());

app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false
}));    

app.get("/", (req, res) => {
  res.send("Serveur OK !");
});

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Accès non autorisé");
  }
}

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});