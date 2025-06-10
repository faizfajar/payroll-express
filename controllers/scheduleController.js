const { Schedule } = require("../models");
const response = require("../helpers/response");

function getRequestContext(req) {
  return {
    auditUserId: req.user ? req.user.id : null,
    auditRequestId: req.request_id || null,
    auditIpAddress: req.client_ip || null,
  };
}

module.exports = {
  async index(req, res) {
    try {
      const schedules = await Schedule.findAll();
      return response.success(
        res,
        "Schedules retrieved successfully",
        schedules
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve schedules");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findByPk(id);
      if (!schedule) return response.notFound(res, "Schedule not found");

      return response.success(res, "Schedule retrieved successfully", schedule);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve schedule");
    }
  },

  async create(req, res) {
    try {
      const { schedule_name, start_time, finish_time } = req.body;

      if (!schedule_name || !start_time || !finish_time) {
        return response.validationError(
          res,
          "Schedule name, start_time, and finish_time are required"
        );
      }

      const schedule = await Schedule.create(
        {
          schedule_name,
          start_time,
          finish_time,
          created_by: req.user.emp_id,
        },
        {
          ...getRequestContext(req),
        }
      );

      return response.success(
        res,
        "Schedule created successfully",
        schedule,
        201
      );
    } catch (err) {
      console.error(err);
      return response.validationError(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { schedule_name, start_time, finish_time } = req.body;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) return response.notFound(res, "Schedule not found");

      await schedule.update(
        {
          schedule_name,
          start_time,
          finish_time,
          updated_at: new Date(),
          updated_by: req.user.emp_id,
        },
        {
          ...getRequestContext(req),
        }
      );

      return response.success(res, "Schedule updated successfully", schedule);
    } catch (err) {
      console.error(err);
      return response.validationError(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) return response.notFound(res, "Schedule not found");

      await schedule.destroy({
        where: {},
        ...getRequestContext(req),
      });
      return response.success(res, "Schedule deleted successfully", null);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to delete schedule");
    }
  },
};
