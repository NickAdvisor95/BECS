"use strict";
module.exports = (sequelize, DataTypes) => {
  const BloodDonation = sequelize.define("BloodDonation", {
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    donor_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donorFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donorLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donation_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  BloodDonation.associate = function (models) {
    // associations can be defined here
  };

  return BloodDonation;
};
