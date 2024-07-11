"use strict";
module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define(
    "Donor",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      passport_Id: {
        type: DataTypes.STRING,
        unique: true,
      },
      blood_type: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      last_donation_date: DataTypes.DATE,
      health_condition: DataTypes.TEXT,
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
