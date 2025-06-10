"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payrolls", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ppr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      days_present: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_overtime_hours: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_reimbursement: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      base_salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      breakdown: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      ip_address: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payrolls");
  },
};
