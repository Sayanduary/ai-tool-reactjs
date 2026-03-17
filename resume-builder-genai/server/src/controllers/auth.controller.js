import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlackListModel from "../models/blacklist.model.js";

/**
 * Register a new user.
 *
 * @route POST /api/auth/register
 * @access Public
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 *
 * @body {string} username - Unique username
 * @body {string} email - User email address
 * @body {string} password - Plain text password
 *
 * @returns {201} User successfully registered
 * @returns {400} Missing fields or user already exists
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(400).json({
      message: "Account already exists with this email or username",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  return res.status(201).json({
    message: "User Registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * Authenticate a user using email and password.
 *
 * @route POST /api/auth/login
 * @access Public
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 * @body {string} email - Registered email
 * @body {string} password - User password
 *
 * @returns {200} Login successful
 * @returns {400} Invalid credentials
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  return res.status(200).json({
    message: "User Logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    },
  });
}

/**
 * Logout the currently authenticated user.
 *
 * Clears the authentication cookie and stores the JWT
 * in a blacklist collection to prevent reuse.
 *
 * @route POST /api/auth/logout
 * @access Public
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 * @returns {200} Logout successful
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlackListModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User Logout Successfully",
  });
}

/**
 * Get details of the currently authenticated user.
 *
 * Requires authentication middleware that attaches
 * the decoded JWT payload to `req.user`.
 *
 * @route GET /api/auth/get-me
 * @access Private
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 * @returns {200} User information
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User Details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export default {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
