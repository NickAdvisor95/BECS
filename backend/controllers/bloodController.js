const { BloodDonation, BloodInventory } = require("../models");

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

    const bloodInventory = await BloodInventory.findOne({
      where: { bloodType },
    });

    if (bloodInventory) {
      bloodInventory.amount += 1;
      await bloodInventory.save();
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

const getBloodInventory = async (req, res) => {
  try {
    const inventory = await BloodInventory.findAll();
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    res.status(500).json({ message: "Failed to fetch blood inventory" });
  }
};

const requestBlood = async (req, res) => {
  try {
    const { bloodType, amount } = req.body;
    const inventory = await BloodInventory.findOne({ where: { bloodType } });

    if (!inventory || inventory.amount < amount) {
      const alternatives = await findAlternativeBloodTypes(bloodType);
      return res
        .status(200)
        .json({ message: "Requested blood type not available", alternatives });
    }

    inventory.amount -= amount;
    await inventory.save();
    res.status(200).json({ message: "Blood requested successfully" });
  } catch (error) {
    console.error("Error requesting blood:", error);
    res.status(500).json({ message: "Failed to request blood" });
  }
};

const findAlternativeBloodTypes = async (bloodType) => {
  // Implement the logic to find alternative blood types based on the compatibility table
  return [];
};

module.exports = {
  addDonation,
  getBloodInventory,
  requestBlood,
};
