"use strict";
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      donor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Donors",
          key: "donor_id",
        },
      },
      message: DataTypes.TEXT,
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {}
  );
  Notification.associate = function (models) {
    Notification.belongsTo(models.Donor, { foreignKey: "donor_id" });
  };
  return Notification;
};
