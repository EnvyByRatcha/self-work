const express = require("express");
const productController = require("../controllers/productController");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getAllProduct)
  .post(productController.createProduct);
productRouter
  .route("/:id")
  .delete(productController.removeProduct)
  .put(productController.updateProduct);

module.exports = productRouter;
