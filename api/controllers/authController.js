const Users = require("../models/userModel");
const encrypt = require("../utils/encrypt");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email, status: "used" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await encrypt.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "success", token: token });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
