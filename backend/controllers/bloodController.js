const { BloodDonation, BloodInventory, BloodType } = require("../models");

// Функция для поиска альтернативных типов крови
const findAlternativeBloodTypes = async (bloodType) => {
  const bloodTypeRecord = await BloodType.findOne({ where: { bloodType } });
  if (bloodTypeRecord) {
    return bloodTypeRecord.receiveBloodFrom.split(", ");
  }
  return [];
};

// Функция для добавления донации крови
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

    // Обновление таблицы blood_inventory
    const inventory = await BloodInventory.findOne({ where: { bloodType } });
    if (inventory) {
      inventory.amount += 1;
      await inventory.save();
    } else {
      await BloodInventory.create({ bloodType, amount: 1 });
    }

    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Failed to add donation" });
  }
};

// Функция для запроса крови с учетом альтернатив и редкости
const requestBlood = async (req, res) => {
  try {
    const { bloodType, amount } = req.body;
    console.log(`Requesting ${amount} units of blood type ${bloodType}`);

    if (bloodType === "O-" && amount > 1) {
      return res
        .status(400)
        .json({
          message:
            "Cannot request more than 1 unit of O- blood at a time in regular mode",
        });
    }

    const inventory = await BloodInventory.findOne({ where: { bloodType } });

    if (!inventory || inventory.amount < amount) {
      console.log(
        "No inventory found for this blood type or not enough blood in inventory"
      );
      const alternatives = await findAlternativeBloodTypes(bloodType);
      const priorityOrder = ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"];

      for (const altType of priorityOrder) {
        if (alternatives.includes(altType)) {
          const altInventory = await BloodInventory.findOne({
            where: { bloodType: altType },
          });
          if (altInventory && altInventory.amount >= amount) {
            return res.status(200).json({
              message: "Requested blood type not available",
              alternatives: [altType],
            });
          }
        }
      }

      return res.status(200).json({
        message:
          "Requested blood type not available and no suitable alternatives",
      });
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

// Функция для запроса крови в чрезвычайной ситуации
const requestBloodEmergency = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(`Requesting ${amount} units of blood type O- in emergency`);

    const inventory = await BloodInventory.findOne({
      where: { bloodType: "O-" },
    });

    if (!inventory || inventory.amount < amount) {
      return res
        .status(400)
        .json({
          message:
            "Requested blood type O- not available in the required amount",
        });
    }

    inventory.amount -= amount;
    await inventory.save();
    console.log(
      `Blood requested successfully in emergency. New quantity: ${inventory.amount}`
    );
    res
      .status(200)
      .json({ message: "Blood requested successfully in emergency" });
  } catch (error) {
    console.error("Error requesting blood in emergency:", error);
    res.status(500).json({ message: "Failed to request blood in emergency" });
  }
};

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

module.exports = {
  addDonation,
  requestBlood,
  getBloodInventory,
  requestBloodEmergency,
};
