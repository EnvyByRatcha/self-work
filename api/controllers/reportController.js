const { Assignment } = require("../models/AssignmentModel");
const { InventoryTransition } = require("../models/Inventorytransition");
const errorHandler = require("../utils/error");

const mapMonthlyArray = (data, key, defaultValue = 0) => {
  return Array.from({ length: 12 }, (_, i) => {
    const found = data.find((item) => item._id.month === i + 1);
    return found ? found[key] : defaultValue;
  });
};

exports.sumperMonth = async (req, res, next) => {
  try {
    const { year } = req.query;
    const currentYear = parseInt(year);

    const assignmentReport = await Assignment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
          status: "approve",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    const inventoryReport = await InventoryTransition.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
          transitionType: "stock-in",
          status: "approve",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    const monthlyAssignmentCosts = mapMonthlyArray(
      assignmentReport,
      "totalCost"
    );
    const monthlyStockInCosts = mapMonthlyArray(inventoryReport, "totalCost");

    const countAssignments = mapMonthlyArray(assignmentReport, "count");
    const countStockIns = mapMonthlyArray(inventoryReport, "count");

    res.status(200).json({
      success: true,
      message: "Report retrieved successfully",
      data: {
        CostPerMonth: {
          assignment: monthlyAssignmentCosts,
          inventory: monthlyStockInCosts,
        },
        countPerMonth: {
          assignment: countAssignments,
          inventory: countStockIns,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
