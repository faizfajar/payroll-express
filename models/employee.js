"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Schedule, {
       foreignKey: "sce_id",
       as: "schedule",
     });
    }
  }

  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sce_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      employee_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      employee_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employee_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employee_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // password: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      // role: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   defaultValue: "employee",
      // },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
      timestamps: true,
      underscored: true,
    }
  );

  return Employee;
};
