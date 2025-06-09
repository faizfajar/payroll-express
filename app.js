const express = require("express");
const app = express();
require("dotenv").config();

// helpers
const errorHandler = require("./middlewares/errorHandler");

// modules
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const payrollPeriodRoutes = require("./routes/payrollPeriodRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const overtimeRoutes = require("./routes/overtimeRoutes");
const reimbursementRoutes = require("./routes/reimbursementRoutes");

// Gunakan route /schedules


app.use(express.json());
app.use("/api/auth", authRoutes);
// data 
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll-periods", payrollPeriodRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/overtimes", overtimeRoutes);
app.use("/api/reimbursement", reimbursementRoutes);


app.use(errorHandler);

module.exports = app;
