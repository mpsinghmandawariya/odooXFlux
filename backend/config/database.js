const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");

const databasePath = path.resolve(
  __dirname,
  "..",
  process.env.DB_FILE || "./database/subscription.sqlite",
);
let database;
let persistTimer;

async function initializeDatabase() {
  if (database) return database;

  const SQL = await initSqlJs({
    locateFile: (file) => require.resolve(`sql.js/dist/${file}`),
  });
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const existingFile = fs.existsSync(databasePath)
    ? fs.readFileSync(databasePath)
    : null;
  database = existingFile ? new SQL.Database(existingFile) : new SQL.Database();
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  database.run("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
  persistDatabase();
  return database;
}

function getDatabase() {
  if (!database) throw new Error("Database has not been initialized.");
  return database;
}

function persistDatabase() {
  if (!database) return;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const temporaryPath = `${databasePath}.tmp`;
    fs.writeFileSync(temporaryPath, Buffer.from(database.export()));
    fs.renameSync(temporaryPath, databasePath);
  }, 0);
}

function closeDatabase() {
  clearTimeout(persistTimer);
  if (database) {
    const temporaryPath = `${databasePath}.tmp`;
    fs.writeFileSync(temporaryPath, Buffer.from(database.export()));
    fs.renameSync(temporaryPath, databasePath);
    database.close();
    database = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  persistDatabase,
  closeDatabase,
  databasePath,
};
