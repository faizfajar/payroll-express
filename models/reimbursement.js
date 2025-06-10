"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reimbursement extends Model {
    static associate(models) {
      Reimbursement.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });
    }
  }

  Reimbursement.init(
    {
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ammount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Ammount must be greater than 0",
          },
        },
      },
      reimbursement_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reimbursement",
      tableName: "reimbursements",
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
                  table_name: "reimbursement",
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
                  table_name: "reimbursement",
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
                  table_name: "reimbursement",
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

  return Reimbursement;
};
