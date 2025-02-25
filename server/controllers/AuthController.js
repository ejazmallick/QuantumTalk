import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// ✅ Signup with Password Hashing
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please provide an email and password");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = createToken(email, user.id);

    return res.status(201).json({
      user: { id: user.id, email: user.email, profileSetup: user.profileSetup },
      token,
      expiresAt: Date.now() + maxAge * 1000,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("An error occurred");
  }
};

// ✅ Login with Token Expiry
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please provide an email and password");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.status(400).send("Incorrect password");

    const token = createToken(email, user.id);
    return res.status(200).json({
      user: { id: user.id, email: user.email, profileSetup: user.profileSetup, name: user.name, image: user.image },
      token,
      expiresAt: Date.now() + maxAge * 1000,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("An error occurred");
  }
};

// ✅ Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.user.userId);
    if (!userData) return res.status(404).send("User not found");

    return res.status(200).json({
      user: { id: userData.id, email: userData.email, profileSetup: userData.profileSetup, name: userData.name, image: userData.image },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("Internal Server error occurred");
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, avatarUrl } = req.body;

    if (!name || !email) return res.status(400).send("Name and email are required.");

    const userData = await User.findByIdAndUpdate(
      userId,
      { name, email, image: avatarUrl, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      user: { id: userData.id, email: userData.email, profileSetup: userData.profileSetup, name: userData.name, image: userData.image },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("Internal Server error occurred");
  }
};

// ✅ Upload Profile Image
export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required." });

    const fileName = `uploads/profiles/${Date.now()}_${req.file.originalname}`;

    try {
      renameSync(req.file.path, fileName);
    } catch (err) {
      console.error("File rename failed:", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/${fileName}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { image: imageUrl },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Profile image updated successfully.", user: { image: updatedUser.image } });
  } catch (error) {
    console.error("Error in addProfileImage:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

// ✅ Remove Profile Image
export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.image) {
      try {
        unlinkSync(user.image);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { image: "" },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Profile image removed successfully.", user: { image: updatedUser.image } });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("Internal Server error occurred");
  }
};
