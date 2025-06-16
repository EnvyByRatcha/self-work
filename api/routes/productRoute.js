const express = require("express");
const productController = require("../controllers/productController");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(allowAll, productController.getAllProduct)
  .post(allowAdmin, productController.createProduct);
productRouter
  .route("/:id")
  .get(allowAll, productController.getProductById)
  .put(allowAdminAndManager, productController.updateProduct)
  .delete(allowAdmin, productController.inactivateProduct);

module.exports = productRouter;
