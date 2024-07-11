"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BloodInventory extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  BloodInventory.init(
    {
      bloodType: DataTypes.STRING,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BloodInventory",
      tableName: "blood_inventory", // Убедитесь, что имя таблицы указано правильно
    }
  );
  return BloodInventory;
};
