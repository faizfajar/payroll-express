const { PayrollPeriod } = require("../models");
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
      const data = await PayrollPeriod.findAll();
      return response.success(
        res,
        "Payroll periods retrieved successfully",
        data
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve payroll periods");
    }
  },

  async getById(req, res) {
    try {
      const data = await PayrollPeriod.findByPk(req.params.id);
      if (!data) return response.notFound(res, "Payroll period not found");
      return response.success(
        res,
        "Payroll period retrieved successfully",
        data
      );
    } catch (err) {
      return response.error(res, "Failed to retrieve payroll period");
    }
  },

  async create(req, res) {
    try {
      const { period_name, type, start_date, finish_date } = req.body;

      if (!period_name || !type || !start_date || !finish_date) {
        response.validationError(
          res,
          "Period Name, Start Date and End Date is required"
        );
      }

      const data = await PayrollPeriod.create(
        {
          period_name,
          type,
          start_date,
          finish_date,
          created_at: new Date(),
          created_by: req.user.emp_id,
        },
        { ...getRequestContext(req) }
      );

      return response.success(
        res,
        "Payroll period created successfully",
        data,
        201
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to create payroll period");
    }
  },

  async update(req, res) {
    try {
      const data = await PayrollPeriod.findByPk(req.params.id);
      if (!data) return response.notFound(res, "Payroll period not found");

      const { period_name, type, start_date, finish_date } = req.body;

      if (!period_name || !type || !start_date || !finish_date) {
        response.validationError(
          res,
          "Period Name, Start Date and End Date is required"
        );
      }
      await data.update(
        {
          period_name,
          type,
          start_date,
          finish_date,
          updated_at: new Date(),
          updated_by: req.user.emp_id,
        },
        { ...getRequestContext(req) }
      );

      return response.success(res, "Payroll period updated successfully", data);
    } catch (err) {
      return response.error(res, "Failed to update payroll period");
    }
  },

  async delete(req, res) {
    try {
      const data = await PayrollPeriod.findByPk(req.params.id);
      if (!data) return response.notFound(res, "Payroll period not found");

      await data.destroy({ where: {}, ...getRequestContext(req) });

      return response.success(
        res,
        "Payroll period deleted successfully",
        null,
        204
      );
    } catch (err) {
      return response.error(res, "Failed to delete payroll period");
    }
  },
};
