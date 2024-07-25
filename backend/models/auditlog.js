"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  AuditLog.init(
    {
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      operation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "AuditLogs",
    }
  );
  return AuditLog;
};
