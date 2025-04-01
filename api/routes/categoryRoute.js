const express = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);
categoryRouter
  .route("/:id")
  .delete(categoryController.removeCategory)
  .put(categoryController.updateCategory);

module.exports = categoryRouter;
