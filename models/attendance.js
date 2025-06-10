"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });
    }
  }

  Attendance.init(
    {
      emp_id: DataTypes.INTEGER,
      attendance_date: DataTypes.DATEONLY,
      check_in: DataTypes.TIME,
      check_out: DataTypes.TIME,
      duration: DataTypes.TIME,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
       
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "attendances",
      underscored: true,
    }
  );

  return Attendance;
};
