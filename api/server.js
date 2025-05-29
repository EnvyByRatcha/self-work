require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const errorHandler = require("./utils/error");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const productBatchRouter = require("./routes/productBatchRoute");
const sparePartRouter = require("./routes/sparePartRoute");
const sparePartBatchRouter = require("./routes/sparePartBatchRoute");
const sparePartUnitRouter = require("./routes/sparePartUnitRoute");
const customerRouter = require("./routes/customerRoute");
const categoryRouter = require("./routes/categoryRoute");
const productUnitRoute = require("./routes/productUnitRoute");
const inventoryTransitionRouter = require("./routes/inventoryTransition");
const assignmentRouter = require("./routes/assignmentRoute");
const technicianRouter = require("./routes/technicianRoute");

const authRouter = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/technicians", technicianRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/productBatches", productBatchRouter);
app.use("/api/v1/productUnits", productUnitRoute);
app.use("/api/v1/spareParts", sparePartRouter);
app.use("/api/v1/sparePartBatches", sparePartBatchRouter);
app.use("/api/v1/sparePartUnits", sparePartUnitRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/inventoryTransition", inventoryTransitionRouter);
app.use("/api/v1/assignments", assignmentRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Path ${req.originalUrl} not found`);
  err.statusCode = 404;
  err.status = "fail";

  next(err);
});
app.use(errorHandler.apiError);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
