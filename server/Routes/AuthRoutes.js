const router = require("express").Router();
const UserModel = require("../db/models/Users");
const LogModel = require("../db/models/Logs");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const generateAuthToken = require("../util/Authtoken");
const { isAuthenticated } = require("../controller/AuthController"); // ✅ FIX

dotenv.config();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAuthToken(user);

    // ✅ Set cookie (works in localhost too)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= USER PROFILE =================
router.get("/userProfile", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("Logs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      logs: user.Logs,
    });
  } catch (error) {
    console.error("UserProfile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= GET ALL USERS =================
router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    const userList = users.filter((u) => u._id.toString() !== req.user.id);
    res.status(200).json(userList);
  } catch (error) {
    console.error("Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= CURRENT USER =================
router.get("/currentuser", isAuthenticated, async (req, res) => {
  try {
    res.status(200).json({ id: req.user.id, username: req.user.username });
  } catch (error) {
    console.error("CurrentUser Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= GET USER BY ID =================
router.get("/users/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("-password")
      .populate("Logs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("GetUserById Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================= LOGOUT =================
router.get("/logout", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = false;
    await user.save();

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
