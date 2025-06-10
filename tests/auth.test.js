const request = require("supertest");
const app = require("../app");

describe("Auth Test", () => {
  it("should fail login with invalid username & password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "invaliduser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should login successfully with valid credentials [ role employee ]", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "employee1", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("role");
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("emp_id");
  });

  it("should login successfully with valid credentials [ role admin ]", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "admin" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("name", "Admin");
    expect(res.body).toHaveProperty("role", "admin");
    expect(res.body).toHaveProperty("username", "admin");
    expect(res.body).toHaveProperty("emp_id");
  });
});
