"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("payroll_period_employee", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ppr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payroll_period", // nama tabel yang direferensi
          key: "id", // kolom primary key di tabel tersebut
        },
        onUpdate: "CASCADE", // opsi jika key diupdate
        onDelete: "CASCADE", // opsi jika data induk dihapus
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("payroll_period_employee");
  },
};
