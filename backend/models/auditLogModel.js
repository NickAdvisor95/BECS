"use strict";
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      operation: DataTypes.STRING,
    },
    {}
  );
  return AuditLog;
};
