app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).send("Utilisateur inconnu");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    return res.status(401).send("Mot de passe incorrect");
  }

  req.session.userId = user.id;

  res.send("Connecté avec succès !");
});