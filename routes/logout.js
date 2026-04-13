app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Déconnecté avec succès !");
  });
});