"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("blood_types", [
      {
        bloodType: "A+",
        donateBloodTo: "A+, AB+",
        receiveBloodFrom: "A+, A-, O+, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "O+",
        donateBloodTo: "O+, A+, B+, AB+",
        receiveBloodFrom: "O+, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "B+",
        donateBloodTo: "B+, AB+",
        receiveBloodFrom: "B+, B-, O+, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "AB+",
        donateBloodTo: "AB+",
        receiveBloodFrom: "Everyone",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "A-",
        donateBloodTo: "A+, A-, AB+, AB-",
        receiveBloodFrom: "A-, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "O-",
        donateBloodTo: "Everyone",
        receiveBloodFrom: "O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "B-",
        donateBloodTo: "B+, B-, AB+, AB-",
        receiveBloodFrom: "B-, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bloodType: "AB-",
        donateBloodTo: "AB+, AB-",
        receiveBloodFrom: "AB-, A-, B-, O-",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("blood_types", null, {});
  },
};
