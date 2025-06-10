const request = require("supertest");
const app = require("../app");
const { Overtime, sequelize } = require("../models");

let overtimeId; 

describe("OvertimeController", () => {
  it("should create overtime", async () => {
    const res = await request(app)
      .post("/api/overtimes")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: 1,
        overtime_date: "2025-06-11",
        start_time: "20:00",
        finish_time: "21:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    overtimeId = res.body.data.id;
  });

  it("should update overtime", async () => {
    const res = await request(app)
      .put(`/api/overtimes/${overtimeId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: 1,
        overtime_date: "2025-06-10",
        start_time: "20:00",
        finish_time: "21:00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.start_time).toContain("20:00");
  });

  it("should get all overtime records", async () => {
    const res = await request(app)
      .get("/api/overtimes")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get overtime by ID", async () => {
    const res = await request(app)
      .get(`/api/overtimes/${overtimeId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(overtimeId);
  });

  it("should delete overtime", async () => {
    const res = await request(app)
      .delete(`/api/overtimes/${overtimeId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200); // atau 204 tergantung implementasi controller
  });

  it("should return 404 for deleted overtime", async () => {
    const res = await request(app)
      .get(`/api/overtimes/${overtimeId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(404);
  });
});
describe("OvertimeController - Validasi cannot exceed 3 hours", () => {
  it("should cannot create an overtime record cause exceed 3hours", async () => {
    const res = await request(app)
      .post("/api/overtimes")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: 1,
        overtime_date: "2025-06-12",
        start_time: "18:00:00",
        finish_time: "21:30:00",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/Overtime cannot exceed 3 hours/i);
  });

});
