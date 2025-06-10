"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });

      Payroll.belongsTo(models.PayrollPeriod, {
        foreignKey: "ppr_id",
        as: "period",
      });
    }
  }

  Payroll.init(
    {
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ppr_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      days_present: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_overtime_hours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_reimbursement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      base_salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      breakdown: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
       
    },
    {
      sequelize,
      modelName: "Payroll",
      tableName: "payrolls",
      timestamps: true,
      underscored: true,
    }
  );

  return Payroll;
};
