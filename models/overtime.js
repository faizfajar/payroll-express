"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Overtime extends Model {
    static associate(models) {
      Overtime.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });
    }
  }

  Overtime.init(
    {
      emp_id: DataTypes.INTEGER,
      overtime_date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      finish_time: DataTypes.TIME,
      duration: DataTypes.TIME,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
       
    },
    {
      sequelize,
      modelName: "Overtime",
      tableName: "overtimes",
      underscored: true,
    }
  );

  return Overtime;
};
