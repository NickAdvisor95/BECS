"use strict";

module.exports = (sequelize, DataTypes) => {
  const BloodType = sequelize.define(
    "BloodType",
    {
      bloodType: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      donateBloodTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiveBloodFrom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "blood_types",
    }
  );

  BloodType.associate = function (models) {
    // associations can be defined here
  };

  return BloodType;
};
