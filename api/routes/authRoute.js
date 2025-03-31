const express = require("express");
const userController = require("../controllers/userController");

const authRouter = express.Router();

authRouter.route("/").post(userController.signIn);

module.exports = authRouter;
