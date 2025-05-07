const express = require("express");
const authController = require('../controllers/authController')

const authRouter = express.Router();

authRouter.route("/").post(authController.signIn);
authRouter.route('/technician').post(authController.signInApp)

module.exports = authRouter;
