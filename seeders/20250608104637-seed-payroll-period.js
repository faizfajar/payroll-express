"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("payroll_period", [
      {
        period_name: "Payroll June 2025",
        type: "monthly",
        start_date: new Date("2025-06-01"),
        finish_date: new Date("2025-06-30"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payroll_period");

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('payroll_period', 'id'), 1, false);
    `);
  },
};
