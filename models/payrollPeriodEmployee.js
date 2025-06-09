"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PayrollPeriodEmployee extends Model {
    static associate(models) {
      PayrollPeriodEmployee.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });

      PayrollPeriodEmployee.belongsTo(models.PayrollPeriod, {
        foreignKey: "ppr_id",
        as: "period",
      });
    }
  }

  PayrollPeriodEmployee.init(
    {
      ppr_id: DataTypes.INTEGER,
      emp_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PayrollPeriodEmployee",
      tableName: "payroll_period_employee",
      timestamps: true,
      underscored: true,
    }
  );

  return PayrollPeriodEmployee;
};
