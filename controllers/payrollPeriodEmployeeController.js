"use strict";

const { PayrollPeriodEmployee, Employee, PayrollPeriod } = require("../models");
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
      const data = await PayrollPeriodEmployee.findAll({
        include: [
          { model: Employee, as: "employee" },
          { model: PayrollPeriod, as: "period" },
        ],
      });

      return response.success(
        res,
        "Payroll period employee retrieved successfully",
        data
      );
    } catch (error) {
      console.error(error);
      return response.error(res, "Failed to retrieve payroll period employees");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await PayrollPeriodEmployee.findByPk(id, {
        include: [
          { model: Employee, as: "employee" },
          { model: PayrollPeriod, as: "period" },
        ],
      });

      if (!data) {
        return response.notFound(res, "Payroll period employee not found");
      }

      return response.success(
        res,
        "Payroll period employee retrieved successfully",
        data
      );
    } catch (error) {
      console.error(error);
      return response.error(res, "Failed to retrieve payroll period employee");
    }
  },

  async getByPeriodId(req, res) {
    try {
      const { ppr_id } = req.params;

      const data = await PayrollPeriodEmployee.findAll({
        where: { ppr_id },
        include: [
          { model: Employee, as: "employee" },
          { model: PayrollPeriod, as: "period" },
        ],
      });

      return response.success(
        res,
        "Payroll period employees retrieved successfully",
        data
      );
    } catch (error) {
      console.error(error);
      return response.error(
        res,
        "Failed to retrieve payroll period employees by period ID"
      );
    }
  },

  async create(req, res) {
    try {
      const { ppr_id, emp_id } = req.body;

      // set empId to array if params is string
      let empIds = emp_id;
      if (!Array.isArray(emp_id)) {
        empIds = emp_id !== undefined && emp_id !== null ? [emp_id] : [];
      }

      if (!ppr_id || empIds.length === 0) {
        return response.validationError(
          res,
          "Payroll Period ID and at least one Employee ID are required"
        );
      }

      // Delete existing mappings for this period
      await PayrollPeriodEmployee.destroy({
        where: { ppr_id },
        ...getRequestContext(req),
        individualHooks: true,
      });

      // insert bulk
      const records = empIds.map((emp_id) => ({
        ppr_id,
        emp_id,
        created_by: req.user.emp_id,
      }));

      const data = await PayrollPeriodEmployee.bulkCreate(records, {
        ...getRequestContext(req),
        individualHooks: true,
      });

      return response.success(res, "Data created successfully", data, 201);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to create data");
    }
  },

  async update(req, res) {
    try {
      const { ppr_id } = req.params;
      const { emp_id } = req.body;

      if (!ppr_id) {
        return response.validationError(res, "Payroll Period ID is required");
      }

      if (!emp_id || (Array.isArray(emp_id) && emp_id.length === 0)) {
        return response.validationError(
          res,
          "At least one Employee ID must be provided"
        );
      }

      const employeeIds = Array.isArray(emp_id) ? emp_id : [emp_id];

      // Delete existing mappings for this period
      await PayrollPeriodEmployee.destroy({
        where: { ppr_id },
        ...getRequestContext(req),
        individualHooks: true,
      });

      // Create new mappings
      const newMappings = employeeIds.map((id) => ({
        ppr_id,
        emp_id: id,
        created_by: req.user.emp_id,
        updated_by: req.user.emp_id,
      }));

      const created = await PayrollPeriodEmployee.bulkCreate(newMappings, {
        ...getRequestContext(req),
        individualHooks: true,
      });

      return response.success(
        res,
        "Payroll period employees updated successfully",
        created
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to update data");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const data = await PayrollPeriodEmployee.findByPk(id);
      if (!data) {
        return response.notFound(res, "Payroll period employee not found");
      }

      await data.destroy({ where: {}, ...getRequestContext(req) });

      await logAudit({
        table: "payroll_period_employee",
        record_id: data.id,
        action: "delete",
        user_id: req.user.id,
        request_id: req.request_id,
      });
      return response.success(
        res,
        "Payroll period employee deleted successfully"
      );
    } catch (error) {
      console.error(error);
      return response.error(res, "Failed to delete payroll period employee");
    }
  },
};
