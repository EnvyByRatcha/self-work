const { Categories } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getAllCategory = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Categories.find().skip(skip).limit(limit);
    const totalCategories = await Categories.countDocuments();

    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      categories: categories,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingCategory = await Categories.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exits" });
    }

    const newCategory = new Categories({
      name,
    });

    await newCategory.save();

    res.status(200).json({ message: "success", category: newCategory });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const updateCategory = await Categories.findByIdAndUpdate(
      categoryId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateCategory) {
      return res.status(409).json({ message: "Category already exits" });
    }

    res.status(200).json({ message: "success", category: updateCategory });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Categories.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.status = "unused";
    category.save();

    res.status(200).json({ message: "success", category: category });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
