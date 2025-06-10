const request = require("supertest");
const app = require("../app");
const dayjs = require("dayjs");

describe("Attendance Controller", () => {
  let createdId;

  it("should create an attendance successfully", async () => {
    const res = await request(app)
      .post("/api/attendances")
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        emp_id: 2,
        attendance_date: "2025-06-20",
        check_in: "09:00",
        check_out: null,
        duration: null,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    createdId = res.body.data.id;
  });

  it("should retrieve all attendances", async () => {
    const res = await request(app)
      .get("/api/attendances")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should retrieve attendance by ID", async () => {
    const res = await request(app)
      .get(`/api/attendances/${createdId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("id", createdId);
  });

  it("should update an attendance", async () => {
    const res = await request(app)
      .put(`/api/attendances/${createdId}`)
      .set("Authorization", `Bearer ${global.token}`)
      .send({
        attendance_date: dayjs().format("YYYY-MM-DD"),
        check_in: "09:00:00",
        check_out: "18:00:00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.check_in).toBe("09:00:00");
  });

  it("should get attendance by employee ID", async () => {
    const res = await request(app)
      .get("/api/attendances/employee/1")
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // it("should get attendance summary by employee and range", async () => {
  //   const start = dayjs().startOf("month").format("YYYY-MM-DD");
  //   const finish = dayjs().endOf("month").format("YYYY-MM-DD");

  //   const res = await request(app)
  //     .get(`/api/attendances/summary/1/${start}/${finish}`)
  //     .set("Authorization", `Bearer ${global.token}`);

  //   // expect(res.statusCode).toBe(200);
  //   // expect(res.body.status).toBe(true);
  //   // expect(Array.isArray(res.body.data)).toBe(true);
  // });

  it("should delete an attendance", async () => {
    const res = await request(app)
      .delete(`/api/attendances/${createdId}`)
      .set("Authorization", `Bearer ${global.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });
});

describe("Attendance Controller - Validation Cases", () => {
  it("should not allow attendance on weekends", async () => {
    // Cari tanggal Sabtu atau Minggu terdekat
    let weekend = dayjs();
    while (weekend.day() !== 0 && weekend.day() !== 6) {
      weekend = weekend.add(1, "day");
    }

    const res = await request(app)
      .post("/api/attendances")
      .set("Authorization", `Bearer ${token}`)
      .send({
        emp_id: 1,
        attendance_date: weekend.format("YYYY-MM-DD"),
        check_in: "08:00:00",
        check_out: "17:00:00",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/weekend/i);
  });

  it("should fail if emp_id is missing", async () => {
    const res = await request(app)
      .post("/api/attendances")
      .set("Authorization", `Bearer ${token}`)
      .send({
        attendance_date: dayjs().format("YYYY-MM-DD"),
        check_in: "08:00:00",
        check_out: "17:00:00",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/employee id/i);
  });

  it("should fail if attendance_date is missing", async () => {
    const res = await request(app)
      .post("/api/attendances")
      .set("Authorization", `Bearer ${token}`)
      .send({
        emp_id: 1,
        check_in: "08:00:00",
        check_out: "17:00:00",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/attendance date/i);
  });

  it("should return 404 for invalid attendance ID on getById", async () => {
    const res = await request(app)
      .get("/api/attendances/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 404 for invalid attendance ID on delete", async () => {
    const res = await request(app)
      .delete("/api/attendances/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return 400 for missing query params on getEmployeeAttendanceByRange", async () => {
    const res = await request(app)
      .get("/api/attendances/summary/1//")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
