"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("overtimes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      overtime_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME(6),
        allowNull: false,
      },
      finish_time: {
        type: Sequelize.TIME(6),
        allowNull: false,
      },
      duration: {
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
    await queryInterface.dropTable("overtimes");
  },
};
