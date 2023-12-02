import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import Jwt from "jsonwebtoken";

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("User created sucessfully");
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found!"));
    const validpassword = bcryptjs.compareSync(password, validUser.password);
    if (!validpassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = Jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
export { signin, signUp };
