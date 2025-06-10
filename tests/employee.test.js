const request = require("supertest");
const app = require("../app"); // Pastikan path ke file utama Express kamu benar
const { Employee, sequelize } = require("../models");

const scheduleId = 1;
let createdEmployeeId;


describe("Employee API", () => {
  it("should create an employee", async () => {
    const res = await request(app)
      .post("/api/employees/")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        sce_id: scheduleId,
        employee_code: "010101",
        employee_first_name: "Faiz",
        employee_last_name: "Aprianda",
        employee_email: "faizfajar.work@gmail.com",
        gender: 0,
        salary: 100000,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    createdEmployeeId = res.body.data.id;
  });

  it("should get all employees", async () => {
    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get employee by ID", async () => {
    const res = await request(app)
      .get(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdEmployeeId);
  });

  it("should update employee's schedule", async () => {
    const res = await request(app)
      .put(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        sce_id: scheduleId,
        employee_first_name: "faizz",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.sce_id).toBe(scheduleId);
  });

  it("should delete employee", async () => {
    const res = await request(app)
      .delete(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 for deleted employee", async () => {
    const res = await request(app)
      .get(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(404);
  });
});
