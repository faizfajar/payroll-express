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
      hooks: {
        afterCreate: async (instance, options) => {
          const auditUserId = options.auditUserId;
          const auditRequestId = options.auditRequestId;
          const auditIpAddress = options.auditIpAddress;

          if (auditUserId || auditIpAddress) {
            try {
              await sequelize.models.AuditLog.create(
                {
                  table_name: "payroll",
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
      },
    }
  );

  return Payroll;
};
