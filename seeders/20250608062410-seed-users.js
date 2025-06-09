"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 1; i <= 100; i++) {
      const passwordHash = await bcrypt.hash("password", 10);
      users.push({
        name: faker.name.fullName(),
        username: `employee${i}`,
        password: passwordHash,
        role: "employee",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Admin
    users.push({
      name: "Admin",
      username: "admin",
      password: await bcrypt.hash("admin", 10),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert("users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null , {});
    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false);
    `);
  },
};
