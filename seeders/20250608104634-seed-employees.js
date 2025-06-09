"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];

    for (let i = 1; i <= 100; i++) {
      const gender = faker.datatype.boolean() ? 0 : 1; // 0 = male, 1 = female
      // const passwordHash = await bcrypt.hash("password", 10);

      employees.push({
        sce_id: 1,
        employee_code: `EMP${String(i).padStart(4, "0")}`,
        employee_first_name: faker.name.firstName(gender),
        employee_last_name: faker.name.lastName(),
        employee_email: `employee${i}@example.com`,
        // password: passwordHash,
        gender,
        // role: "employee",
        // created_at: new Date(),
        // updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("employees", employees, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employees", null, {});

    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('employees', 'id'), 1, false);
    `);
  },
};
