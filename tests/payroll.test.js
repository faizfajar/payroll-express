const request = require("supertest");
const app = require("../app");
const { Payroll, PayrollPeriod } = require("../models");

let ppr_id = 1;
let emp_id = 1;

describe("PayrollController Integration Test", () => {
  beforeAll(async () => {
    // Kosongkan hasil payroll agar tidak duplikat
    await Payroll.destroy({ where: {} });
    await PayrollPeriod.update({ is_processed: false },{where: {}});
  });

  describe("Process Payroll Employee", () => {
    it("should run payroll and generate payslips", async () => {
      const res = await request(app)
        .post("/api/payroll/process-payroll")
        .set("Authorization", `Bearer ${global.token}`)
        .send({ ppr_id });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toMatch(/success/i);

      // emp_id = res.body.data[0].emp_id;
    });

    it("should not run payroll again for the same period", async () => {
      const res = await request(app)
        .post("/api/payroll/process-payroll")
        .set("Authorization", `Bearer ${global.token}`)
        .send({ ppr_id });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch(/already been processed/i);
    });

    it("should return error if ppr_id not provided", async () => {
      const res = await request(app)
        .post("/api/payroll/process-payroll")
        .set("Authorization", `Bearer ${global.token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch(/required/i);
    });
  });

  describe("GET /api/payroll/generate-payslip/:ppr_id", () => {

    it("should return error for non-existent period", async () => {
      const res = await request(app)
        .get("/api/payroll/generate-payslip/9999")
        .set("Authorization", `Bearer ${global.token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
    });
  });

  describe("GET /api/payroll/summary/:ppr_id", () => {
    it("should return payroll summary for the period", async () => {
      const res = await request(app)
        .get(`/api/payroll/summary/${ppr_id}`)
        .set("Authorization", `Bearer ${global.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("summary");
      expect(Array.isArray(res.body.data.summary)).toBe(true);
      expect(res.body.data).toHaveProperty("total_take_home_all_employee");
    });
  });
});
