const jwt = require("jsonwebtoken");
const User = require("../models/User");

function extractToken(req) {
  const fromCookie = req.cookies?.accessToken;
  if (fromCookie) {
    return fromCookie;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

async function adminAuth(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      const error = new Error("Access token missing");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    if (user.role !== "admin") {
      const error = new Error("Admin access required");
      error.statusCode = 403;
      throw error;
    }

    req.user = user;
    next();
  } catch (err) {
    const status = err.statusCode || 401;
    res.status(status).json({
      message: err.message || "Invalid or expired token",
    });
  }
}

module.exports = { adminAuth };
