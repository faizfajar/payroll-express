"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PayrollPeriod extends Model {
    static associate(models) {
    }
  }

  PayrollPeriod.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      period_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "PayrollPeriod",
      tableName: "payroll_period",
      timestamps: true,
    }
  );

  return PayrollPeriod;
};
