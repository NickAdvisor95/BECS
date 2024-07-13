"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isRegularUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isResearchStudent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mustChangePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {}
  );

  User.associate = function (models) {
    // associations can be defined here
  };

  return User;
};
