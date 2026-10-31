require("dotenv").config();

const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const { initializeDatabase, closeDatabase } = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();
const port = Number(process.env.PORT) || 5000;
const jwtSecret = process.env.JWT_SECRET || "";

if (
  jwtSecret.length < 32 ||
  /replace_with|your_own_long_random_secret/i.test(jwtSecret)
) {
  console.error(
    "JWT configuration error: set JWT_SECRET in server/.env to a private random value of at least 32 characters.",
  );
  process.exit(1);
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));
app.disable("x-powered-by");

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Subscription Management API is running.",
    database: "SQLite",
  });
});

app.get("/api/db-status", (_req, res) => {
  res.json({ success: true, database: "SQLite", connected: true });
});

app.use("/api/auth", authRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res
      .status(400)
      .json({ success: false, message: "Request body must be valid JSON." });
  }
  console.error("API error:", error.message);
  return res
    .status(500)
    .json({ success: false, message: "An unexpected server error occurred." });
});

async function start() {
  await initializeDatabase();
  const server = app.listen(port, () => {
    console.log("SQLite database connected successfully.");
    console.log(`Server running at http://localhost:${port}`);
    console.log(
      "Auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me",
    );
  });

  const shutdown = () => {
    server.close(() => {
      closeDatabase();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
}

module.exports = { app, start };
