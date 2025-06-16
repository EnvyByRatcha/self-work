const express = require("express");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter
  .route("/:id")
  .get(allowAll, userController.getUserById)
  .put(allowAdminAndManager, userController.updateUserById)
  .delete(allowAdmin, userController.inactiveUserById);

userRouter
  .route("/")
  .get(allowAll, userController.getAllUsers)
  .post(allowAdmin, userController.createUser);

module.exports = userRouter;
