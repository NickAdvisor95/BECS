"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "BloodDonations",
      "passportId",
      "donor_id"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "BloodDonations",
      "donor_id",
      "passportId"
    );
  },
};
