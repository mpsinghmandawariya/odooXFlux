const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = [/[A-Z]/, /[a-z]/, /[^A-Za-z0-9]/];

function issueToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d", algorithm: "HS256" },
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!name || name.length > 100) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Enter a name between 1 and 100 characters.",
        });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address." });
    }
    if (
      password.length <= 8 ||
      !passwordRules.every((rule) => rule.test(password))
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Password must be longer than 8 characters and include uppercase, lowercase, and a special character.",
        });
    }
    if (User.findByEmail(email)) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists.",
        });
    }

    // Public registrations can only create customer accounts; role is never accepted from the request.
    const user = await User.create({ name, email, password, role: "customer" });
    return res
      .status(201)
      .json({
        success: true,
        message: "Account created successfully.",
        token: issueToken(user),
        user: User.toPublicUser(user),
      });
  } catch (error) {
    if (error.message && /UNIQUE constraint failed/i.test(error.message)) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists.",
        });
    }
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    const user = email ? User.findByEmail(email) : null;

    if (!user || !(await User.verifyPassword(password, user.password_hash))) {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect." });
    }

    return res.json({
      success: true,
      message: "Signed in successfully.",
      token: issueToken(user),
      user: User.toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  const user = User.findById(Number(req.auth.sub));
  if (!user)
    return res
      .status(401)
      .json({
        success: false,
        message: "The account for this token no longer exists.",
      });
  return res.json({ success: true, user: User.toPublicUser(user) });
});

module.exports = router;
