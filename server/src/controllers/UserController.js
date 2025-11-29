const User = require("../models/User");
const { generateToken } = require("../utils/genrateToken");
const { sanitizePayload } = require("../utils/sanitizePayload");

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
}

function buildCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_DAY_IN_MS,
    path: "/",
  };
}

function setSessionCookie(res, user) {
  const token = generateToken(user._id.toString());
  res.cookie("accessToken", token, buildCookieOptions());
}

const register = async (req, res) => {
  try {
    const payload = sanitizePayload({ ...(req.body || {}) });
    const {
      firstName,
      lastName,
      email,
      password,
      role = "user",
    } = payload;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const normalizedRole = role === "admin" ? "admin" : "user";
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: normalizedRole,
    });

    setSessionCookie(res, user);

    res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = sanitizePayload({ ...(req.body || {}) });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    setSessionCookie(res, user);

    res.json({
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

const logout = async (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, me, logout };
