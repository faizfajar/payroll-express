"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.hasOne(models.Employee, {
        foreignKey: "sce_id",
        as: "schedule",
      });
    }
  }

  Schedule.init(
    {
      schedule_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      finish_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "schedules",
      timestamps: true,
      underscored: true,
    }
  );

  return Schedule;
};
