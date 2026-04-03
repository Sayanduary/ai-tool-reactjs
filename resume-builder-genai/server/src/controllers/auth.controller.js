import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlackListModel from "../models/blacklist.model.js";
import userModel from "../models/user.model.js";

/* ================= REGISTER ================= */
export async function registerUserController(req, res, next) {
  try {
    const { username, email, password } = req.body || {};

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
        message: "Account already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in env");
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, // ✅ REQUIRED for tunnel
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    next(err);
  }
}

/* ================= LOGIN ================= */
export async function loginUserController(req, res, next) {
  try {
    console.log(" LOGIN HIT");

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      throw new Error("User password missing in DB");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in env");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, // ✅ correct for tunnel
    });

    return res.status(200).json({ message: "Login success" });
  } catch (err) {
    console.error("🔥 LOGIN CRASH:", err);
    next(err);
  }
}

/* ================= LOGOUT ================= */
export async function logoutUserController(req, res, next) {
  try {
    const token = req.cookies.token;

    if (token) {
      await tokenBlackListModel.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      message: "User Logout Successfully",
    });
  } catch (err) {
    console.error("🔥 LOGOUT ERROR:", err);
    next(err);
  }
}

/* ================= GET ME ================= */
export async function getMeController(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User Details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 GETME ERROR:", err);
    next(err);
  }
}
