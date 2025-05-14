const express = require("express");
const sparePartBatchController = require("../controllers/sparePartBatchController");

const sparePartBatchRouter = express.Router();

sparePartBatchRouter
  .route("/sparePart/:id")
  .get(sparePartBatchController.getSparePartBatchByProductId);

module.exports = sparePartBatchRouter;
