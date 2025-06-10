const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { Overtime, Employee, Schedule } = require("../models");
const response = require("../helpers/response");
const { Op } = require("sequelize");
const overtime = require("../models/overtime");

dayjs.extend(utc);
module.exports = {
  async index(req, res) {
    try {
      const overtimes = await Overtime.findAll({
        include: {
          model: Employee,
          as: "employee",
        },
      });

      return response.success(
        res,
        "Overtime retrieved successfully",
        overtimes
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve overtimes");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const overtime = await Overtime.findByPk(id, {
        include: {
          model: Employee,
          as: "employee",
        },
      });

      if (!overtime) return response.notFound(res, "Overtime not found");

      return response.success(res, "Overtime retrieved successfully", overtime);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve overtime");
    }
  },

  async getByEmployeeId(req, res) {
    try {
      const { emp_id } = req.params;

      if (!emp_id) {
        return response.validationError(res, "Employee ID is required");
      }

      const overtimes = await Overtime.findAll({
        where: { emp_id },
        include: {
          model: Employee,
          as: "employee",
          attributes: [
            "id",
            "employee_code",
            "employee_first_name",
            "employee_last_name",
            "employee_email",
            "gender",
          ],
        },
        order: [["overtime_date", "DESC"]],
      });

      if (!overtimes.length) {
        return response.notFound(res, "No overtime found for this employee");
      }

      return response.success(
        res,
        "Employee overtime data retrieved successfully",
        overtimes
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve employee overtime data");
    }
  },

  async create(req, res) {
    try {
      const { emp_id, overtime_date, start_time, finish_time } = req.body;
       

      if (!emp_id || !overtime_date || !start_time || !finish_time) {
        return response.validationError(
          res,
          "Employee ID, Overtime Date, Start Time, and Finish Time are required"
        );
      }

      const employee = await Employee.findByPk(emp_id, {
        include: { model: Schedule, as: "schedule" },
      });

      if (!employee) return response.notFound(res, "Employee not found");
      if (!employee.schedule)
        return response.validationError(
          res,
          "Employee does not have a schedule assigned"
        );

      const scheduleFinish = dayjs(
        `2000-01-01T${employee.schedule.finish_time}`
      );
      const start = dayjs(`2000-01-01T${start_time}`);
      const finish = dayjs(`2000-01-01T${finish_time}`);

      if (start.isBefore(scheduleFinish)) {
        return response.validationError(
          res,
          "Overtime cannot start before schedule finish time"
        );
      }

      const durationMs = finish.diff(start);
      const maxDurationMs = 3 * 60 * 60 * 1000;
      const toleranceMs = 1000;

      if (durationMs <= 0) {
        return response.validationError(
          res,
          "Finish time must be after start time"
        );
      }

      if (durationMs > maxDurationMs + toleranceMs) {
        return response.validationError(res, "Overtime cannot exceed 3 hours");
      }

      // Check for overlapping overtime
      const existing = await Overtime.findOne({
        where: {
          emp_id,
          overtime_date,
          [Op.or]: [
            {
              start_time: {
                [Op.lt]: finish_time,
              },
              finish_time: {
                [Op.gt]: start_time,
              },
            },
          ],
        },
      });

      if (existing) {
        return response.validationError(
          res,
          "Overtime overlaps with an existing request"
        );
      }

      const durationStr = dayjs.utc(durationMs).format("HH:mm:ss");

      const overtime = await Overtime.create({
        emp_id,
        overtime_date,
        start_time,
        finish_time,
        duration: durationStr,
        created_by: req.user.emp_id,
         
      });

      await logAudit({
        table: "overtime",
        record_id: overtime.id,
        action: "create",
        user_id: req.user.id,
        request_id: req.request_id,
      });

      return response.success(
        res,
        "Overtime created successfully",
        overtime,
        201
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to create overtime");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { emp_id, overtime_date, start_time, finish_time } = req.body;
       

      if (!emp_id || !overtime_date || !start_time || !finish_time) {
        return response.validationError(
          res,
          "Employee ID, Overtime Date, Start Time, and Finish Time are required"
        );
      }

      const overtime = await Overtime.findByPk(id);
      if (!overtime) return response.notFound(res, "Overtime not found");

      const employee = await Employee.findByPk(emp_id, {
        include: { model: Schedule, as: "schedule" },
      });

      if (!employee) return response.notFound(res, "Employee not found");
      if (!employee.schedule)
        return response.validationError(
          res,
          "Employee does not have a schedule assigned"
        );

      const scheduleFinish = dayjs(
        `2000-01-01T${employee.schedule.finish_time}`
      );
      const start = dayjs(`2000-01-01T${start_time}`);
      const finish = dayjs(`2000-01-01T${finish_time}`);

      if (start.isBefore(scheduleFinish)) {
        return response.validationError(
          res,
          "Overtime cannot start before schedule finish time"
        );
      }

      const durationMs = finish.diff(start);
      const maxDurationMs = 3 * 60 * 60 * 1000;
      const toleranceMs = 1000;

      if (durationMs <= 0) {
        return response.validationError(
          res,
          "Finish time must be after start time"
        );
      }

      if (durationMs > maxDurationMs + toleranceMs) {
        return response.validationError(res, "Overtime cannot exceed 3 hours");
      }

      // Validasi overlap: selain ID ini
      const overlapping = await Overtime.findOne({
        where: {
          emp_id,
          overtime_date,
          id: { [Op.ne]: id }, // exclude current ID
          [Op.and]: [
            { start_time: { [Op.lt]: finish_time } },
            { finish_time: { [Op.gt]: start_time } },
          ],
        },
      });

      if (overlapping) {
        return response.validationError(
          res,
          "Updated overtime overlaps with another request"
        );
      }

      const durationStr = dayjs.utc(durationMs).format("HH:mm:ss");

      await overtime.update({
        emp_id,
        overtime_date,
        start_time,
        finish_time,
        duration: durationStr,
        updated_by: req.user.emp_id,
         
      });

      await logAudit({
        table: "overtime",
        record_id: overtime.id,
        action: "update",
        user_id: req.user.id,
        request_id: req.request_id,
      });

      return response.success(res, "Overtime updated successfully", overtime);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to update overtime");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const overtime = await Overtime.findByPk(id);

      if (!overtime) return response.notFound(res, "Overtime not found");

      await overtime.destroy();

      await logAudit({
        table: "overtime",
        record_id: id,
        action: "delete",
        user_id: req.user.id,
        request_id: req.request_id,
      });
      return response.success(res, "Overtime deleted successfully");
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to delete overtime");
    }
  },
};
