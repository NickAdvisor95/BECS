"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Donors", "firstName", "donorFirstName");
    await queryInterface.renameColumn("Donors", "lastName", "donorLastName");
    await queryInterface.renameColumn("Donors", "passport_Id", "donor_id");
    await queryInterface.renameColumn("Donors", "blood_type", "bloodType");
    await queryInterface.renameColumn("Donors", "birth_date", "birthdayDonor");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Donors", "donorFirstName", "firstName");
    await queryInterface.renameColumn("Donors", "donorLastName", "lastName");
    await queryInterface.renameColumn("Donors", "donor_id", "passport_Id");
    await queryInterface.renameColumn("Donors", "bloodType", "blood_type");
    await queryInterface.renameColumn("Donors", "birthdayDonor", "birth_date");
  },
};
