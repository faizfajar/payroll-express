"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      // optional: relate to user if needed
    }
  }

  AuditLog.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      table_name: DataTypes.STRING,
      record_id: DataTypes.INTEGER,
      action: DataTypes.STRING,
      performed_by: DataTypes.INTEGER,
      request_id: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "audit_logs",
      timestamps: false,
      underscored: true,
    }
  );

  return AuditLog;
};
