import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const { isEmail } = validator;
const schema = mongoose.Schema;

const userschema = new schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter your email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your pasword"],
    minlength: [6, "Minimun password length must be 6 characters"],
  },
});
userschema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userschema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const Users = mongoose.model("user", userschema);
export default Users;
