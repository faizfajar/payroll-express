const { Employee, Schedule } = require("../models"); // pastikan Schedule sudah diimport
const response = require("../helpers/response");

module.exports = {
  async index(req, res) {
    try {
      const employees = await Employee.findAll({
        include: {
          model: Schedule,
          as: "schedule",
        },
      });
      return response.success(
        res,
        "Employees retrieved successfully",
        employees
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve employees");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id, {
        include: {
          model: Schedule,
          as: "schedule", // ini penting! Harus sesuai alias
        },
      });
      if (!employee) return response.notFound(res, "Employee not found");

      return response.success(res, "Employee retrieved successfully", employee);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve employee");
    }
  },

  async create(req, res) {
    try {
      const { sce_id } = req.body;

      if (!sce_id) {
        return response.validationError(
          res,
          "Anda harus memasukkan schedule di employee ini"
        );
      }

      const employee = await Employee.create(req.body);
      return response.success(
        res,
        "Employee created successfully",
        employee,
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
      const { sce_id } = req.body;

      const employee = await Employee.findByPk(id);
      if (!employee) return response.notFound(res, "Employee not found");

      if (!sce_id) {
        return response.validationError(res, "Anda harus memasukkan schedule (sce_id)");
      }

      const schedule = await Schedule.findByPk(sce_id);
      if (!schedule) {
        return response.validationError(res, "Schedule tidak ditemukan");
      }

      await employee.update({ sce_id });

      return response.success(res, "Employee updated successfully", employee);
    } catch (err) {
      console.error(err);
      return response.validationError(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      if (!employee) return response.notFound(res, "Employee not found");

      await employee.destroy();
      return response.success(res, "Employee deleted successfully", null);
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to delete employee");
    }
  },
};
