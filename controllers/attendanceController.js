const { Attendance, Employee } = require("../models");
const response = require("../helpers/response");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

function calculateDuration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;

  const start = dayjs(`1970-01-01T${checkIn}`);
  const end = dayjs(`1970-01-01T${checkOut}`);

  if (!start.isValid() || !end.isValid() || end.isBefore(start)) return null;

  const diffMinutes = end.diff(start, "minute");

  const hours = Math.floor(diffMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (diffMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:00`;
}

module.exports = {
  async index(req, res) {
    try {
      const data = await Attendance.findAll({
        include: [{ model: Employee, as: "employee" }],
      });
      return response.success(res, "Attendances retrieved successfully", data);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve attendances");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Attendance.findByPk(id, {
        include: [{ model: Employee, as: "employee" }],
      });

      if (!data) return response.notFound(res, "Attendance not found");

      return response.success(res, "Attendance retrieved successfully", data);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve attendance");
    }
  },

  async getByEmployeeId(req, res) {
    try {
      const { emp_id } = req.params;
      const data = await Attendance.findAll({
        where: { emp_id },
        include: [{ model: Employee, as: "employee" }],
      });

      return response.success(res, "Attendances retrieved successfully", data);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve attendances");
    }
  },

  async getEmployeeAttendanceByRange(req, res) {
    try {
      const { emp_id, start, finish } = req.params;

      if (!emp_id || !start || !finish) {
        return res.status(400).json({
          success: false,
          message: "emp_id, start, and finish are required",
        });
      }

      // count total day employee present
      const totalAttendance = await Attendance.count({
        where: {
          emp_id: emp_id,
          attendance_date: {
            [Op.between]: [start, finish],
          },
        },
        distinct: true,
        col: "attendance_date",
      });

      return res.status(200).json({
        success: true,
        message: "Attendance summary retrieved successfully",
        data: [
          {
            emp_id: Number(emp_id),
            start_date: start,
            finish_date: finish,
            total_attendance: totalAttendance,
          },
        ],
      });
    } catch (err) {
      console.error("Error in getEmployeeAttendanceByRange:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch attendance summary",
      });
    }
  },

  async create(req, res) {
    try {
      const { emp_id, attendance_date, check_in, check_out } = req.body;

      if (!emp_id || !attendance_date) {
        return response.validationError(
          res,
          "Employee ID and attendance date are required"
        );
      }

      // check day is weekend / weekdays
      const day = dayjs(attendance_date).day();
      if (day === 0 || day === 6) {
        return response.validationError(
          res,
          "Cannot submit attendance on weekends"
        );
      }

      // calculate duration when start & finish date is exists
      const duration = calculateDuration(check_in, check_out);

      const data = await Attendance.create({
        emp_id,
        attendance_date,
        check_in,
        check_out,
        duration,
      });

      return response.success(
        res,
        "Attendance recorded successfully",
        data,
        201
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to record attendance");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { attendance_date, check_in, check_out } = req.body;

      const data = await Attendance.findByPk(id);
      if (!data) return response.notFound(res, "Attendance not found");

      // check day is weekend / weekdays
      const day = dayjs(attendance_date).day();
      if (day === 0 || day === 6) {
        return response.validationError(
          res,
          "Cannot submit attendance on weekends"
        );
      }

      // re calculate duration when start & finish date is exists
      const duration = calculateDuration(
        check_in ?? data.check_in,
        check_out ?? data.check_out
      );

      await data.update({
        attendance_date,
        check_in: check_in ?? data.check_in,
        check_out: check_out ?? data.check_out,
        duration,
      });

      return response.success(res, "Attendance updated successfully", data);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to update attendance");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await Attendance.findByPk(id);

      if (!data) return response.notFound(res, "Attendance not found");

      await data.destroy();
      return response.success(res, "Attendance deleted successfully");
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to delete attendance");
    }
  },
};
