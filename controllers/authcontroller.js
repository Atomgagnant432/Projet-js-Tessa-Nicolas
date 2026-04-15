const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const UserModel = require("../src/model/user");

exports.register = async (req, res) => {
  const { email, pseudo, password } = req.body;

  if (!email || !pseudo || !password)
    return res.status(400).json({ error: 'Tous les champs sont demandés' });

  if (UserModel.findByEmail(email))
    return res.status(409).json({ error: 'Email déjà utilisé' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), email, pseudo, password: hashedPassword, favorites: [] };
  UserModel.create(newUser);

  req.session.userId = newUser.id;

  res.status(201).json({ message: 'Inscription réalisée avec succès', user: { id: newUser.id, email, pseudo } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = UserModel.findByEmail(email);

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
  const user = UserModel.findById(req.session.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ id: user.id, email: user.email, pseudo: user.pseudo });
};
