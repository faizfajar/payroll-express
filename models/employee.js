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
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
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
      hooks: {
        afterCreate: async (instance, options) => {
          const auditUserId = options.auditUserId;
          const auditRequestId = options.auditRequestId;
          const auditIpAddress = options.auditIpAddress;


          if ((auditUserId || auditIpAddress)) {
            try {
              await sequelize.models.AuditLog.create(
                {
                  table_name: "employee",
                  record_id: instance.id,
                  action: "CREATE",
                  performed_by: auditUserId,
                  request_id: auditRequestId,
                  ip_address: auditIpAddress,
                },
                { transaction: options.transaction }
              );
            } catch (error) {
              console.log('====================================');
              console.log(error);
              console.log('====================================');
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
                  table_name: "employee",
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
                  table_name: "employee",
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

  return Employee;
};
