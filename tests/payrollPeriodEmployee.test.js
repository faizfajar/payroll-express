const request = require("supertest");
const app = require("../app");
const {
  PayrollPeriodEmployee,
  Employee,
  PayrollPeriod,
  sequelize,
} = require("../models");

let recordId;
let ppr_id = 1;
describe("PayrollPeriodEmployeeController", () => {

  it("should create payroll period employee records", async () => {
    const res = await request(app)
      .post("/api/payroll-period-employees/")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        ppr_id,
        emp_id: [1,2,]
      });

    expect(res.statusCode).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    recordId = res.body.data[0].id;
  });

  it("should get all payroll period employee records", async () => {
    const res = await request(app)
      .get("/api/payroll-period-employees")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get payroll period employee by ID", async () => {
    const res = await request(app)
      .get(`/api/payroll-period-employees/${recordId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(recordId);
  });

  it("should get payroll period employees by period ID", async () => {
    const res = await request(app)
      .get(`/api/payroll-period-employees/period/${ppr_id}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should update payroll period employee records", async () => {
    const res = await request(app)
      .put(`/api/payroll-period-employees/${ppr_id}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        ppr_id,
        emp_id: [1, 2, 3],
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].emp_id).toBe(1);
  });

  it("should delete payroll period employee record by ID", async () => {
    const toDelete = await PayrollPeriodEmployee.create({
      ppr_id,
      emp_id: 2,
    });

    const res = await request(app)
      .delete(`/api/payroll-period-employees/${toDelete.id}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 for non-existent payroll period employee", async () => {
    const res = await request(app)
      .get("/api/payroll-period-employees/999999")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(404);
  });
});
