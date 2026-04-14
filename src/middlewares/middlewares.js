module.exports = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Accès non autorisé, veuillez vous connecter.' });
  }
  next();
};