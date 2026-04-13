app.get("/profile", isAuthenticated, (req, res) => {
  res.send("Bienvenue " + req.session.userId);
});