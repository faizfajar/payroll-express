const request = require("supertest");
const app = require("../app");
const { PayrollPeriod, sequelize } = require("../models");


let payrollPeriodId;
describe("PayrollPeriodController", () => {

  it("should create a payroll period", async () => {
    const res = await request(app)
      .post("/api/payroll-periods")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        period_name: "January 2025",
        type: "monthly",
        start_date: "2025-01-01",
        finish_date: "2025-01-31",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    payrollPeriodId = res.body.data.id;
  });

  it("should retrieve all payroll periods", async () => {
    const res = await request(app)
      .get("/api/payroll-periods")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should retrieve payroll period by ID", async () => {
    const res = await request(app)
      .get(`/api/payroll-periods/${payrollPeriodId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(payrollPeriodId);
  });

  it("should update payroll period", async () => {
    const res = await request(app)
      .put(`/api/payroll-periods/${payrollPeriodId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        period_name: "January 2025 Updated",
        type: "monthly",
        start_date: "2025-01-01",
        finish_date: "2025-01-31",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.period_name).toBe("January 2025 Updated");
  });

  it("should delete payroll period", async () => {
    const res = await request(app)
      .delete(`/api/payroll-periods/${payrollPeriodId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(204);
  });

  it("should return 404 when getting deleted payroll period", async () => {
    const res = await request(app)
      .get(`/api/payroll-periods/${payrollPeriodId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(404);
  });
});
