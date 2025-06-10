const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const path = require("path");

module.exports = async () => {
  const res = await request(app).post("/api/auth/login").send({
    username: "admin",
    password: "admin",
  });

  if (!res.body || !res.body.token) {
    throw new Error("Login failed: Token not received");
  }

  const tokenPath = path.join(__dirname, "token-cache.json");
  fs.writeFileSync(
    tokenPath,
    JSON.stringify({ token: res.body.token }),
    "utf-8"
  );
};
