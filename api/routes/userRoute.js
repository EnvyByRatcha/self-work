const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(auth.verifyToken, userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route("/:id")
  .get(auth.verifyToken, userController.getUserById)
  .put(auth.verifyToken, userController.updateUserById)
  .delete(auth.verifyToken, userController.inactiveUserById);

module.exports = userRouter;
