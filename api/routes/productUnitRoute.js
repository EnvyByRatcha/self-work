const express = require("express");
const productUnitController = require("../controllers/productUnitController");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");

const productUnitRouter = express.Router();

productUnitRouter
  .route("/")
  .post(allowAdminAndManager, productUnitController.createProductUnit);
  
productUnitRouter
  .route("/:id")
  .get(allowAll, productUnitController.getProductUnitByProductId)
  .put(allowAdminAndManager, productUnitController.updateProductUnit)
  .delete(allowAdmin, productUnitController.inactiveProductUnit);

productUnitRouter
  .route("/customer/:id")
  .get(allowAll, productUnitController.getProductUnitByCustomerId);

module.exports = productUnitRouter;
