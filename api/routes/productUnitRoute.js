const express = require("express");
const productUnitController = require("../controllers/productUnitController");

const productUnitRouter = express.Router();

productUnitRouter
  .route("/")
  .get(productUnitController.getAllProductUnit)
  .post(productUnitController.createProductUnit);
productUnitRouter
  .route("/:id")
  .delete(productUnitController.removePProductUnit)
  .put(productUnitController.updateProductUnit);

module.exports = productUnitRouter;
