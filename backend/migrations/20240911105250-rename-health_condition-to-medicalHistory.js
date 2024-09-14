"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      "Donors",
      "health_condition",
      "medicalHistory"
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      "Donors",
      "medicalHistory",
      "health_condition"
    );
  },
};
