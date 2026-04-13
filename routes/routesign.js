app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    email,
    password: hashedPassword
  });

  res.send("Utilisateur créé !");
});