const Customers = require("../models/customerModel");
const errorHandler = require("../utils/error");

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customers.find();
    res.status(200).json({ message: "success", customers: customers });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { name, customerCode, address, tel_1, tel_2, email } = req.body;

    const existingCustomer = await Customers.findOne({ name });
    if (existingCustomer) {
      return res.status(409).json({ message: "Customer already exits" });
    }

    const newCustomer = new Customers({
      name,
      customerCode,
      address,
      tel_1,
      tel_2,
      email,
    });
    await newCustomer.save();

    res.status(201).json({ status: "Success", customer: newCustomer });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customers.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const restrictedFields = ["_id", "createAt"];
    restrictedFields.forEach((field) => delete req.body[field]);

    Object.keys(req.body).forEach((key) => {
      customer[key] = req.body[key];
    });

    await customer.save();

    res.status(200).json({ status: "success", customer: customer });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customers.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.status = "unused";
    customer.save();

    res.status(200).json({ status: "success", customer: customer });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
