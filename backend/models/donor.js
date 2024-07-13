"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donor.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      passport_Id: DataTypes.STRING,
      blood_type: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      last_donationDate: DataTypes.DATE,
      health_condition: DataTypes.TEXT,
      insurance: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Donor",
    }
  );
  return Donor;
};
