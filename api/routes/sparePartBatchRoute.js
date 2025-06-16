const express = require("express");
const sparePartBatchController = require("../controllers/sparePartBatchController");
const { allowAll } = require("../middleware/roleAccess");

const sparePartBatchRouter = express.Router();

sparePartBatchRouter
  .route("/sparePart/:id")
  .get(allowAll, sparePartBatchController.getSparePartBatchByProductId);

module.exports = sparePartBatchRouter;
