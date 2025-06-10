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
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PayrollPeriod",
      tableName: "payroll_period",
      timestamps: false,
      underscored: true,
      hooks: {
        afterCreate: async (instance, options) => {
          const auditUserId = options.auditUserId;
          const auditRequestId = options.auditRequestId;
          const auditIpAddress = options.auditIpAddress;

          if (auditUserId || auditIpAddress) {
            try {
              await sequelize.models.AuditLog.create(
                {
                  table_name: "payroll_period",
                  record_id: instance.id,
                  action: "CREATE",
                  performed_by: auditUserId,
                  request_id: auditRequestId,
                  ip_address: auditIpAddress,
                },
                { transaction: options.transaction }
              );
            } catch (error) {
              console.log("====================================");
              console.log(error);
              console.log("====================================");
            }
          }
        },
        afterUpdate: async (instance, options) => {
          const auditUserId = options.auditUserId;
          const auditRequestId = options.auditRequestId;
          const auditIpAddress = options.auditIpAddress;

          if (auditUserId || auditIpAddress) {
            try {
              await sequelize.models.AuditLog.create(
                {
                  table_name: "payroll_period",
                  record_id: instance.id,
                  action: "UPDATE",
                  performed_by: auditUserId,
                  request_id: auditRequestId,
                  ip_address: auditIpAddress,
                },
                { transaction: options.transaction }
              );
            } catch (error) {
              console.log("====================================");
              console.log(error);
              console.log("====================================");
            }
          }
        },
        afterDestroy: async (instance, options) => {
          const auditUserId = options.auditUserId;
          const auditRequestId = options.auditRequestId;
          const auditIpAddress = options.auditIpAddress;

          if (auditUserId || auditIpAddress) {
            try {
              await sequelize.models.AuditLog.create(
                {
                  table_name: "payroll_period",
                  record_id: instance.id,
                  action: "DELETE",
                  performed_by: auditUserId,
                  request_id: auditRequestId,
                  ip_address: auditIpAddress,
                },
                { transaction: options.transaction }
              );
            } catch (error) {
              console.log("====================================");
              console.log(error);
              console.log("====================================");
            }
          }
        },
      },
    }
  );

  return PayrollPeriod;
};
