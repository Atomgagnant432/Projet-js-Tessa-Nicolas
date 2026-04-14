const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data/users.json');

function getUsers() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

exports.register = async (req, res) => {
  const { email, pseudo, password } = req.body;

  if (!email || !pseudo || !password)
    return res.status(400).json({ error: 'Tous les champs sont demandés' });

  const users = getUsers();

  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email déjà utilisé' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), email, pseudo, password: hashedPassword };

  users.push(newUser);
  saveUsers(users);

  req.session.userId = newUser.id;

  res.status(201).json({ message: 'Inscription réalisée avec succès', user: { id: newUser.id, email, pseudo } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  req.session.userId = user.id;

  res.json({ message: 'Connexion réussie !', user: { id: user.id, email: user.email, pseudo: user.pseudo } });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Déconnecté avec succès !' });
  });
};

exports.me = (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ id: user.id, email: user.email, pseudo: user.pseudo });
};