import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync, existsSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please provide an email and password");

    // ❌ Don't hash the password here! UserModel.js will do it automatically.
    const user = await User.create({ name, email, password });
    
    // Fetch all existing users to update their contacts
    const existingUsers = await User.find({});
    console.log("Existing users fetched:", existingUsers); // Debug log

    for (const existingUser of existingUsers) {
        if (!existingUser.contacts.includes(user._id)) {
            existingUser.contacts.push(user._id);
            console.log(`Added user ID ${user._id} to contacts of user ID ${existingUser._id}`); // Debug log
        }

        await existingUser.save();
    }


    const token = createToken(email, user.id);

    return res.status(201).json({
      user: { id: user.id, email: user.email, profileSetup: user.profileSetup },
      token,
      expiresAt: Date.now() + maxAge * 1000,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("An error occurred");
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please provide an email and password");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const auth = await user.comparePassword(password);
    console.log("Password Comparison:", { password, userPassword: user.password, auth }); // Debugging log
    console.log("User ID:", user.id); // Additional debugging log to capture user ID


    if (!auth) return res.status(400).send("The password you entered is incorrect. Please try again.");


    const token = createToken(email, user.id);
    return res.status(200).json({
      user: { id: user.id, email: user.email, profileSetup: user.profileSetup, name: user.name, image: user.image },
      token,
      expiresAt: Date.now() + maxAge * 1000,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("An error occurred");
  }
};

// ✅ Get User Info
export const getUserInfo = async (req, res) => {
  try {
    console.log("🛠️ Debugging getUserInfo - req.user:", req.user); // Debugging

    const userId = req.user.userId || req.user.id;  // 🔥 Ensure we get the user ID
    if (!userId) return res.status(401).json({ error: "Unauthorized - User ID missing" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      user: { id: user.id, email: user.email, profileSetup: user.profileSetup, name: user.name, image: user.image },
    });
  } catch (error) {
    console.error("❌ Error in getUserInfo:", error);
    return res.status(500).json("Internal Server Error");
  }
};


// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, avatarUrl } = req.body;
    if (!name || !email) return res.status(400).send("Name and email are required.");

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, image: avatarUrl, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      user: { id: updatedUser.id, email: updatedUser.email, profileSetup: updatedUser.profileSetup, name: updatedUser.name, image: updatedUser.image },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server error occurred");
  }
};

// ✅ Upload Profile Image  
export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required." });

    const uploadPath = path.join("uploads", "profiles");
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = path.join(uploadPath, fileName);

    renameSync(req.file.path, filePath);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${fileName}`;

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
        // ✅ Extract the file name from the image URL
        const imagePath = new URL(user.image).pathname;
        const filePath = path.join("uploads", "profiles", path.basename(imagePath));

        // ✅ Ensure file exists before attempting to delete
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    // ✅ Update user profile image in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { image: "" },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Profile image removed successfully.", user: { image: updatedUser.image } });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server error occurred");
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { 
      httpOnly: true, 
      expires: new Date(0), // ⏳ Expire the cookie immediately
      secure: true, 
      sameSite: "None"
    });

    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
