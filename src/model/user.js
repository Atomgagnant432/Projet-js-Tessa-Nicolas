const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/user.json");

const readUsers = () => {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
};

const writeUsers = (users) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

const findByEmail = (email) => {
  const users = readUsers();
  return users.find((u) => u.email === email) || null;
};

const findById = (id) => {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
};

const create = (userData) => {
  const users = readUsers();
  users.push(userData);
  writeUsers(users);
  return userData;
};

const update = (updatedUser) => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index === -1) throw new Error("Utilisateur introuvable");
  users[index] = updatedUser;
  writeUsers(users);
  return updatedUser;
};

module.exports = { findByEmail, findById, create, update };