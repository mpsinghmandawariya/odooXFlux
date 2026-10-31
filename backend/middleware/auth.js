const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return next();
  } catch {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
  }
}

module.exports = { requireAuth };
