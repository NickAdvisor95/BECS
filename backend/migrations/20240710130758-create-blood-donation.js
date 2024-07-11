"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BloodDonations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bloodType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      donationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      passportId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      donorFirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      donorLastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("BloodDonations");
  },
};
