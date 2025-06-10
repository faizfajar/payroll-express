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
    }
  );

  return Reimbursement;
};
