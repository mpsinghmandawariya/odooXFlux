const bcrypt = require("bcryptjs");
const { getDatabase, persistDatabase } = require("../config/database");

const SALT_ROUNDS = 12;

function findByEmail(email) {
  const database = getDatabase();
  const statement = database.prepare(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?",
  );
  try {
    statement.bind([email]);
    return statement.step() ? statement.getAsObject() : null;
  } finally {
    statement.free();
  }
}

function findById(id) {
  const database = getDatabase();
  const statement = database.prepare(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
  );
  try {
    statement.bind([id]);
    return statement.step() ? statement.getAsObject() : null;
  } finally {
    statement.free();
  }
}

async function create({ name, email, password, role = "customer" }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const database = getDatabase();
  database.run(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role],
  );
  const row = findByEmail(email);
  persistDatabase();
  return row;
}

function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function toPublicUser(user) {
  if (!user) return null;
  const { id, name, email, role, created_at: createdAt } = user;
  return { id, name, email, role, createdAt };
}

module.exports = {
  findByEmail,
  findById,
  create,
  verifyPassword,
  toPublicUser,
};
