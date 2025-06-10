const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");
const { v4: uuidv4 } = require("uuid");

// Middlewares
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const payrollPeriodRoutes = require("./routes/payrollPeriodRoutes");
const payrollPeriodEmployeeRoutes = require("./routes/payrollPeriodEmployeeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const overtimeRoutes = require("./routes/overtimeRoutes");
const reimbursementRoutes = require("./routes/reimbursementRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

// Basic middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.set("trust proxy", true);

// Assign request_id and clientIp for every request
app.use((req, res, next) => {
  req.client_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
  req.request_id = uuidv4();
  next();
});

// Optional logging middleware
app.use((req, res, next) => {
  console.log(
    `[${req.request_id}] ${req.method} ${req.originalUrl} from ${req.clientIp}`
  );
  next();
});

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (require auth)
app.use(authMiddleware);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll-periods", payrollPeriodRoutes);
app.use("/api/payroll-period-employees", payrollPeriodEmployeeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/overtimes", overtimeRoutes);
app.use("/api/reimbursement", reimbursementRoutes); // plural
app.use("/api/attendances", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
