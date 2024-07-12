const { BloodDonation, BloodInventory } = require("../models");

// Функция для получения инвентаря крови
const getBloodInventory = async (req, res) => {
  try {
    const inventory = await BloodInventory.findAll();
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    res.status(500).json({ message: "Failed to fetch blood inventory" });
  }
};

// Функция для добавления донации
const addDonation = async (req, res) => {
  try {
    const {
      bloodType,
      donationDate,
      donor_id,
      donorFirstName,
      donorLastName,
      donation_type,
    } = req.body;

    const newDonation = await BloodDonation.create({
      bloodType,
      donationDate,
      donor_id,
      donorFirstName,
      donorLastName,
      donation_type,
      isUsed: false,
    });

    const inventory = await BloodInventory.findOne({ where: { bloodType } });
    if (inventory) {
      inventory.amount += 1;
      await inventory.save();
    } else {
      await BloodInventory.create({
        bloodType,
        amount: 1,
      });
    }

    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Failed to add donation" });
  }
};

// Функция для запроса крови
const requestBlood = async (req, res) => {
  try {
    const { bloodType, amount } = req.body;
    console.log(`Requesting ${amount} units of blood type ${bloodType}`);

    const inventory = await BloodInventory.findOne({ where: { bloodType } });

    if (!inventory) {
      console.log("No inventory found for this blood type");
      const alternatives = await findAlternativeBloodTypes(bloodType);
      return res
        .status(200)
        .json({ message: "Requested blood type not available", alternatives });
    }

    if (inventory.amount < amount) {
      console.log(
        `Not enough blood in inventory. Available: ${inventory.amount}, Requested: ${amount}`
      );
      const alternatives = await findAlternativeBloodTypes(bloodType);
      return res
        .status(200)
        .json({ message: "Requested blood type not available", alternatives });
    }

    inventory.amount -= amount;
    await inventory.save();
    console.log(
      `Blood requested successfully. New quantity: ${inventory.amount}`
    );
    res.status(200).json({ message: "Blood requested successfully" });
  } catch (error) {
    console.error("Error requesting blood:", error);
    res.status(500).json({ message: "Failed to request blood" });
  }
};

const findAlternativeBloodTypes = async (bloodType) => {
  // Логика поиска альтернативных типов крови
};

module.exports = {
  addDonation,
  requestBlood,
  getBloodInventory, // Убедитесь, что функция экспортируется
};
