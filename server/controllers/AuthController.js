import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

const maxAge = 3 * 24 * 60 * 60;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res) => {
  try {
    const { name,email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please provide an email and password");
    }
    const user = await User.create({ name, email, password });
    res.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: 'none',
    });
    console.log("User signed up:", user); // Print user data to console
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json("An error occurred");
  }
};

export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send("Please provide an email and password");
      }
      const user = await User.findOne({  email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).send("password not correct");
        }
        console.log("User signed in:", user); // Print user data to console
      res.cookie('jwt', createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: 'none',
      });
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
          name: user.name,
          image: user.image,
          color: user.color,
        },
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json("An error occurred");
    }
  };