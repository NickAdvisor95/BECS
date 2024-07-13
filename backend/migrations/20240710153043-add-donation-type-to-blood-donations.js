"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("BloodDonations", "donation_type", {
      type: Sequelize.ENUM("blood", "plasma"),
      allowNull: false,
      defaultValue: "blood",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("BloodDonations", "donation_type");
  },
};
