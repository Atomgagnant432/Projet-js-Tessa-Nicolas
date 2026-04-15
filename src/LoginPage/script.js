function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

async function handleLogin() {
  try {
    const email = valueOf("email");
    const password = valueOf("password");
    await login(email, password);
    window.location.href = "../HomePage/index.html";
  } catch (err) {
    alert(err?.message || "Connexion impossible");
  }
}

async function handleRegister() {
  try {
    const pseudo = valueOf("pseudo");
    const email = valueOf("email");
    const password = valueOf("password");
    await register(email, pseudo, password);
    window.location.href = "../HomePage/index.html";
  } catch (err) {
    alert(err?.message || "Inscription impossible");
  }
}

// Permet de valider au clavier (Enter) sans dépendre des onclick.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (document.getElementById("pseudo")) handleRegister();
  else if (document.getElementById("password")) handleLogin();
});

