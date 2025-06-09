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
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      finish_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_processed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PayrollPeriod",
      tableName: "payroll_period",
      timestamps: false,
      underscored: true,
    }
  );

  return PayrollPeriod;
};
