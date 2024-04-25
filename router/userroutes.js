import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import cookieparser from "cookie-parser";
import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import requireAuth from "../middlewear/authmiddle.js";

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "that password is not correct";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
const maxage = 3 * 24 * 60 * 60;
function createtoken(id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: maxage });
}

router.get("/", requireAuth, (req, res) => {
  res.render("home");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createtoken(user._id);
    res.cookie("jwt", token, {
      maxAge: maxage * 1000,
      httpOnly: true,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ errors: error });
  }
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createtoken(user._id);
    res.cookie("jwt", token, {
      maxAge: maxage * 1000,
      httpOnly: true,
    });
    res.status(201).json({ user });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ errors: error });
  }
});
router.get("/logout", async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
  });
  res.redirect("/login");
});
export default router;
