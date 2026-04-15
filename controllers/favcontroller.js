const UserModel = require("../src/model/user");

const getFavorites = (req, res) => {
  const user = UserModel.findById(req.session.userId);
  if (!user) return res.status(401).json({ error: "Connectez-vous" });

  res.json({ favorites: user.favorites || [] });
};

const toggleFavorite = (req, res) => {
  const { tmdbId, mediaType } = req.body;

  if (!tmdbId || !mediaType) {
    return res.status(400).json({ error: "tmdbId et mediaType requis" });
  }

  const user = UserModel.findById(req.session.userId);
  if (!user) return res.status(401).json({ error: "Connectez-vous" });

  if (!user.favorites) user.favorites = [];

  const existingIndex = user.favorites.findIndex(
    (fav) => fav.tmdbId === tmdbId && fav.mediaType === mediaType
  );

  let action;
  if (existingIndex !== -1) {
    user.favorites.splice(existingIndex, 1);
    action = "removed";
  } else {
    user.favorites.push({ tmdbId, mediaType });
    action = "added";
  }

  UserModel.update(user);

  res.json({ action, favorites: user.favorites });
};

module.exports = { getFavorites, toggleFavorite };