const express = require("express");
const inventoryTransitionController = require("../controllers/InventorytransitionController");
const inventoryTransitionRouter = express.Router();
const { allowAll, allowAdminAndManager } = require("../middleware/roleAccess");

inventoryTransitionRouter
  .route("/")
  .get(allowAll, inventoryTransitionController.getAllInventoryTransitions)
  .post(
    allowAdminAndManager,
    inventoryTransitionController.createInventoryTransition
  );

inventoryTransitionRouter
  .route("/:id")
  .get(allowAll, inventoryTransitionController.getInventoryTransitionById);

inventoryTransitionRouter
  .route("/approve/:id")
  .put(allowAdminAndManager, inventoryTransitionController.approveTransition);

inventoryTransitionRouter
  .route("/technicianIssued")
  .post(
    allowAdminAndManager,
    inventoryTransitionController.createTechnicianIssued
  );

inventoryTransitionRouter
  .route("/productTranfered")
  .post(
    allowAdminAndManager,
    inventoryTransitionController.createProductTranfered
  );

module.exports = inventoryTransitionRouter;
