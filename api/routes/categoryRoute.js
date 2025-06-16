const express = require("express");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");
const categoryController = require("../controllers/categoryController");
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(allowAll, categoryController.getAllCategory)
  .post(allowAdminAndManager, categoryController.createCategory);

categoryRouter
  .route("/:id")
  .get(allowAll, categoryController.getCategoryById)
  .delete(allowAdmin, categoryController.inactiveCategoryById)
  .put(allowAdminAndManager, categoryController.updateCategoryById);

module.exports = categoryRouter;
