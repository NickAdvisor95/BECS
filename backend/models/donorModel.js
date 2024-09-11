"use strict";
module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define(
    "Donor",
    {
      donorFirstName: DataTypes.STRING,
      donorLastName: DataTypes.STRING,
      donor_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      bloodType: DataTypes.STRING,
      birthdayDonor: DataTypes.DATE,
      last_donation_date: DataTypes.DATE,
      medicalHistory: DataTypes.TEXT,
      insurance: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {}
  );
  Donor.associate = function (models) {
    Donor.hasMany(models.BloodDonation, { foreignKey: "donor_id" });
    Donor.hasMany(models.Notification, { foreignKey: "donor_id" });
  };
  return Donor;
};
