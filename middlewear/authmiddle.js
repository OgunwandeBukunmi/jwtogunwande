import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/usermodel.js";

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    const data = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN,
      (err, user) => {
        if (err) {
          res.redirect("/login");
        } else {
          next();
        }
      }
    );
  } else {
    return res.redirect("/login");
  }
};
export const checkuser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, use) => {
      if (err) {
        console.log(err.message);
        res.locals.user = "";
        next();
      } else {
        console.log(use);
        let user = await User.findById(use.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = "";
    next();
  }
};

export default requireAuth;
