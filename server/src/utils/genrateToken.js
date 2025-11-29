const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function assertSecret() {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
}

const generateToken = (id) => {
  assertSecret();
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { generateToken };