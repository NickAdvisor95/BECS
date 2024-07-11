"use strict";
module.exports = (sequelize, DataTypes) => {
  const BloodType = sequelize.define("BloodType", {
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    donateBloodTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiveBloodFrom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  BloodType.associate = function (models) {
    // associations can be defined here
  };

  return BloodType;
};
