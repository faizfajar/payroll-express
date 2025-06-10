"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sce_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_code: Sequelize.STRING,
      employee_first_name: Sequelize.STRING,
      employee_last_name: Sequelize.STRING,
      employee_email: Sequelize.STRING,
      // password: Sequelize.STRING,
      gender: Sequelize.INTEGER,
      salary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // role: Sequelize.STRING,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
       
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("employees");
  },
};
