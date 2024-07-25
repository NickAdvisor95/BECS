const {
  BloodDonation,
  BloodInventory,
  BloodType,
  AuditLog,
} = require("../models");

// function for search alternative blood types
const findAlternativeBloodTypes = async (bloodType) => {
  const bloodTypeRecord = await BloodType.findOne({ where: { bloodType } });
  if (bloodTypeRecord) {
    return bloodTypeRecord.receiveBloodFrom.split(", ");
  }
  return [];
};

// function for input donation
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

    // when we add donation we need update table in bd blood_inventory
    const inventory = await BloodInventory.findOne({ where: { bloodType } });
    if (inventory) {
      inventory.amount += 1;
      await inventory.save();
    } else {
      await BloodInventory.create({ bloodType, amount: 1 });
    }

    // Log the operation
    await AuditLog.create({
      timestamp: new Date(),
      operation: `Added donation: ${donorFirstName} ${donorLastName} donated ${donation_type} of blood type ${bloodType}`,
    });

    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Failed to add donation" });
  }
};

// function that active when user click on request blood. Work accordance with alternatives and prevalence
const requestBlood = async (req, res) => {
  try {
    const { bloodType, amount } = req.body;
    console.log(`Requesting ${amount} units of blood type ${bloodType}`);

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
            // Log the operation
            await AuditLog.create({
              timestamp: new Date(),
              operation: `Requested blood type ${bloodType} not available. Suggested alternative: ${altType}`,
            });

            return res.status(200).json({
              message: "Requested blood type not available",
              alternatives: [altType],
            });
          }
        }
      }

      // Log the operation
      await AuditLog.create({
        timestamp: new Date(),
        operation: `Requested blood type ${bloodType} not available and no suitable alternatives`,
      });

      return res.status(200).json({
        message:
          "Requested blood type not available and no suitable alternatives",
      });
    }

    if (bloodType === "O-" && amount > 1) {
      return res.status(400).json({
        message:
          "You can only request 1 unit of O- blood at a time in regular mode",
      });
    }

    inventory.amount -= amount;
    await inventory.save();

    // Log the operation
    await AuditLog.create({
      timestamp: new Date(),
      operation: `Requested ${amount} units of blood type ${bloodType}`,
    });

    console.log(
      `Blood requested successfully. New quantity: ${inventory.amount}`
    );
    res.status(200).json({ message: "Blood requested successfully" });
  } catch (error) {
    console.error("Error requesting blood:", error);
    res.status(500).json({ message: "Failed to request blood" });
  }
};

// function for request blood emergency
const requestBloodEmergency = async (req, res) => {
  try {
    const { bloodType, amount } = req.body;
    console.log(
      `Requesting ${amount} units of blood type ${bloodType} in emergency`
    );

    const inventory = await BloodInventory.findOne({ where: { bloodType } });

    if (!inventory || inventory.amount < amount) {
      console.log(
        "No inventory found for this blood type or not enough blood in inventory"
      );

      // Log the operation
      await AuditLog.create({
        timestamp: new Date(),
        operation: `Requested blood type ${bloodType} not available in emergency`,
      });

      return res.status(200).json({
        message:
          "Requested blood type not available and no suitable alternatives in emergency",
      });
    }

    inventory.amount -= amount;
    await inventory.save();

    // Log the operation
    await AuditLog.create({
      timestamp: new Date(),
      operation: `Requested ${amount} units of blood type ${bloodType} in emergency`,
    });

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

// function for get blood inventory
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
  requestBloodEmergency,
  getBloodInventory,
};
