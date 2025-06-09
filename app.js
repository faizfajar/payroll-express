const express = require("express");
const app = express();
require("dotenv").config();

// middlewares
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

// modules
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const payrollPeriodRoutes = require("./routes/payrollPeriodRoutes");
const payrollPeriodEmployeeRoutes = require("./routes/payrollPeriodEmployeeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const overtimeRoutes = require("./routes/overtimeRoutes");
const reimbursementRoutes = require("./routes/reimbursementRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

app.use(express.json());

// public routes 
app.use("/api/auth", authRoutes);
app.use(authMiddleware);

app.use("/api/employees", employeeRoutes);
app.use("/api/payroll-periods", payrollPeriodRoutes);
app.use("/api/payroll-period-employees", payrollPeriodEmployeeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/overtimes", overtimeRoutes);
app.use("/api/reimbursement", reimbursementRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);

app.use(errorHandler);

module.exports = app;
