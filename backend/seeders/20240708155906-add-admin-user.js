"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = "admin"; // Новый пароль в чистом виде
    const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль перед вставкой

    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          password_hash: hashedPassword,
          isAdmin: true,
          isRegularUser: false,
          isResearchStudent: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", { username: "admin" }, {});
  },
};
