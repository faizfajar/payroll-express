const { Reimbursement, Employee } = require("../models");
const response = require("../helpers/response");

module.exports = {
  async index(req, res) {
    try {
      const reimbursements = await Reimbursement.findAll({
        include: {
          model: Employee,
          as: "employee",
        },
        order: [["created_at", "DESC"]],
      });

      return response.success(
        res,
        "Reimbursements retrieved successfully",
        reimbursements
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve reimbursements");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const reimbursement = await Reimbursement.findByPk(id, {
        include: {
          model: Employee,
          as: "employee",
        },
      });

      if (!reimbursement)
        return response.notFound(res, "Reimbursement not found");

      return response.success(
        res,
        "Reimbursement retrieved successfully",
        reimbursement
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve reimbursement");
    }
  },

  async getByEmployeeId(req, res) {
    try {
      const { emp_id } = req.params;

      if (!emp_id) {
        return response.validationError(res, "Employee ID is required");
      }

      const reimbursements = await Reimbursement.findAll({
        where: { emp_id },
        include: {
          model: Employee,
          as: "employee",
        },
        order: [["created_at", "DESC"]],
      });

      return response.success(
        res,
        "Reimbursements retrieved successfully",
        reimbursements
      );
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to retrieve reimbursements");
    }
  },

  async create(req, res) {
    try {
      const { emp_id, description, ammount } = req.body;
      console.log('====================================');
      console.log(!emp_id, description, ammount);
      console.log('====================================');
      
      

      if (!emp_id || !ammount && ammount != 0) {
        return response.validationError(
          res,
          "Employee ID and Ammount are required"
        );
      }

      const reimbursement = await Reimbursement.create({
        emp_id,
        description,
        ammount,
      });

      return response.success(
        res,
        "Reimbursement created successfully",
        reimbursement,
        201
      );
    } catch (err) {
      console.error(err);
      if (err.name === "SequelizeValidationError") {
        return response.validationError(res, err.errors[0].message);
      }
      return response.error(res, "Failed to create reimbursement");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { emp_id, description, ammount } = req.body;

      if (!emp_id || (!ammount && ammount != 0)) {
        return response.validationError(
          res,
          "Employee ID and Ammount are required"
        );
      }

      const reimbursement = await Reimbursement.findByPk(id);
      if (!reimbursement)
        return response.notFound(res, "Reimbursement not found");

      await reimbursement.update({ emp_id, description, ammount });

      return response.success(
        res,
        "Reimbursement updated successfully",
        reimbursement
      );
    } catch (err) {
      console.error(err);
      if (err.name === "SequelizeValidationError") {
        return response.validationError(res, err.errors[0].message);
      }
      return response.error(res, "Failed to update reimbursement");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const reimbursement = await Reimbursement.findByPk(id);
      if (!reimbursement)
        return response.notFound(res, "Reimbursement not found");

      await reimbursement.destroy();

      return response.success(res, "Reimbursement deleted successfully");
    } catch (err) {
      console.error(err);
      return response.error(res, "Failed to delete reimbursement");
    }
  },
};
