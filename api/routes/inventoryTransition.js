const express = require("express");
const inventoryTransitionController = require("../controllers/InventorytransitionController");
const inventoryTransitionRouter = express.Router();
const auth = require("../middleware/auth");

inventoryTransitionRouter
  .route("/")
  .get(inventoryTransitionController.getAllInventoryTransitions)
  .post(
    auth.verifyToken,
    inventoryTransitionController.createInventoryTransition
  );

inventoryTransitionRouter
  .route("/:id")
  .get(inventoryTransitionController.getInventoryTransitionDetail);

inventoryTransitionRouter
  .route("/approve/:id")
  .put(inventoryTransitionController.approveTransition);

module.exports = inventoryTransitionRouter;
