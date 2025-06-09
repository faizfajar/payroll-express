"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("attendances", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      attendance_date_in: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      attendance_time_in: {
        type: Sequelize.TIME(6),
        allowNull: false,
      },
      attendance_date_out: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      attendance_time_out: {
        type: Sequelize.TIME(6),
        allowNull: true,
      },
      attendance_duration: {
        type: Sequelize.TIME(6),
        allowNull: true,
      },
      late_duration: {
        type: Sequelize.TIME(6),
        allowNull: true,
      },
      early_duration: {
        type: Sequelize.TIME(6),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("attendances");
  },
};
