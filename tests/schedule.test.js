const request = require("supertest");
const app = require("../app"); // asumsi nama file utama Express-mu
const { Reimbursement, sequelize } = require("../models");

let reimbursementId;
let testEmpId = 1;

beforeAll(async () => {
  // Optional: bersihkan data reimbursement dari dummy user
  await Reimbursement.destroy({ where: { emp_id: testEmpId } });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Reimbursement API", () => {
  it("should create a reimbursement", async () => {
    const res = await request(app)
      .post("/api/reimbursement")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: testEmpId,
        description: "Medical claim",
        ammount: 500000,
        reimbursement_date: "2025-06-10",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    reimbursementId = res.body.data.id;
  });

  it("should get all reimbursements", async () => {
    const res = await request(app)
      .get("/api/reimbursement")
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get reimbursement by ID", async () => {
    const res = await request(app)
      .get(`/api/reimbursement/${reimbursementId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(reimbursementId);
  });

  it("should get reimbursement by employee ID", async () => {
    const res = await request(app)
      .get(`/api/reimbursement/employee/${testEmpId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should update a reimbursement", async () => {
    const res = await request(app)
      .put(`/api/reimbursement/${reimbursementId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: testEmpId,
        description: "Updated claim",
        ammount: 750000,
        reimbursement_date: "2025-06-11",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.description).toBe("Updated claim");
  });

  it("should delete a reimbursement", async () => {
    const res = await request(app)
      .delete(`/api/reimbursement/${reimbursementId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 when trying to get deleted reimbursement", async () => {
    const res = await request(app)
      .get(`/api/reimbursement/${reimbursementId}`)
      .set("Authorization", `Bearer ${global.token}`);
    expect(res.statusCode).toBe(404);
  });
});
