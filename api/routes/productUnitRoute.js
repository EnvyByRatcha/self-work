const express = require("express");
const productUnitController = require("../controllers/productUnitController");

const productUnitRouter = express.Router();

productUnitRouter.route("/").post(productUnitController.createProductUnit);
productUnitRouter
  .route("/:id")
  .get(productUnitController.getProductUnitByProductId)
  .delete(productUnitController.removePProductUnit)
  .put(productUnitController.updateProductUnit);
productUnitRouter
  .route("/customer/:id")
  .get(productUnitController.getProductUnitByCustomerId);

module.exports = productUnitRouter;
