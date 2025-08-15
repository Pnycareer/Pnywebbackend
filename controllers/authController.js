// controllers/authController.js
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateTokenAndSetCookie } from "../utils/jwttoken.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, contact, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPass = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      contact,
      role,
      password: hashedPass,
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // During login, after finding the user
    if (user.blocked) {
      return res
        .status(403)
        .json({ msg: "User is blocked. Contact admin." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // Generate JWT access token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in response (not as cookie)
    res.status(200).json({
      msg: "Login successful",
      data: {
        accessToken: token,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

export { registerUser, loginUser };
