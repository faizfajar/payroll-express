"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "schedules",
      [
        {
          schedule_name: "Regular 8 hours working",
          start_time: "09:00:00",
          finish_time: "17:00:00",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("schedules", null, {});
    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('schedules', 'id'), 1, false);
    `);
  },
};
