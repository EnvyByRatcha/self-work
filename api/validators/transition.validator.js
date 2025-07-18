const Joi = require("joi");

const createTransitionSchema = Joi.object({
  transition: Joi.object({
    transitionType: Joi.string()
      .valid("stock-in", "stock-out", "technician-issued", "product-tranfered")
      .required(),
    technicianId: Joi.string(),
    customerId: Joi.string(),
  }).required(),
  details: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().optional(),
        sparePartId: Joi.string().optional(),
        productBatchId: Joi.string(),
        sparePartBatchId: Joi.string(),
        productUnitId: Joi.string(),
        sparePartUnitId: Joi.string(),
        serialNumber: Joi.string(),
        cost: Joi.number().required(),
        qty: Joi.number().greater(0).required(),
        type: Joi.string().valid("product", "sparepart"),
      }).xor("productId", "sparePartId")
    )
    .min(1)
    .required(),
});

module.exports = {
  createTransitionSchema,
};
