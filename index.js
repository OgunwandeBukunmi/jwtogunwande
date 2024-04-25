import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
dotenv.config();
import router from "./router/userroutes.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { checkuser } from "./middlewear/authmiddle.js";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieparser());
app.get("*", checkuser);

app.use("/", router);
mongoose
  .connect(process.env.MONGOURI)
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`listening on PORT ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
