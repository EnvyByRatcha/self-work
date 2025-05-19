const express = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);
categoryRouter
  .route("/:id")
  .get(categoryController.getCategoryById)
  .delete(categoryController.inactiveCategoryById)
  .put(categoryController.updateCategoryById);

module.exports = categoryRouter;
