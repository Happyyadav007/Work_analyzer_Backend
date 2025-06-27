import EmployerUser from "../models/EmployerUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerEmployerUser = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    console.log(req.body);

    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await EmployerUser.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    // If file uploaded, get its URL, else null
    const profile_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const employerUser = new EmployerUser({
      name,
      phone,
      email,
      password_hash,
      role,
      profile_image_url,
    });

    await employerUser.save();

    res.status(201).json({ message: "Employer user registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllEmployerUsers = async (req, res) => {
  try {
    const users = await EmployerUser.find().select("-password_hash");
    // Exclude password_hash for security

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getEmployerUserById = async (req, res) => {
  try {
    const { id } = req.params; // empId from URL param

    const user = await EmployerUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Employer user not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginEmployerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(res.getHeaders());

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await EmployerUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last_login to now and save
    user.last_login = new Date();
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return success response with token and user info
    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_image_url: user.profile_image_url,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};
//Refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Verify the user still exists
    EmployerUser.findById(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user);
        console.log("newAcessToken:-", newAccessToken)
        return res.status(200).json({ token: newAccessToken });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: "Server error", error: error.message });
      });
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
