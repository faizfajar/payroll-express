require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "kepolu123",
    database: process.env.DB_NAME || "salary-system",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "kepolu123",
    database: process.env.DB_NAME_TEST || "salary-system-testing",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_PROD || "database_production",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
};
