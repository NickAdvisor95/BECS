const {
  BloodDonation,
  BloodInventory,
  BloodType,
  AuditLog,
  User,
} = require("../models");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;
    const user = await User.findByPk(userId);

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
      await BloodInventory.create({ bloodType, amount: 1 });
    }

    await AuditLog.create({
      timestamp: new Date(),
      operation: `Added donation: ${donorFirstName} ${donorLastName} donated ${donation_type} of blood type ${bloodType} by user ${user.username}`,
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

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;
    const user = await User.findByPk(userId);

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
            await AuditLog.create({
              timestamp: new Date(),
              operation: `Requested blood type ${bloodType} not available. Suggested alternative: ${altType} by user ${user.username}`,
            });

            return res.status(200).json({
              message: "Requested blood type not available",
              alternatives: [altType],
            });
          }
        }
      }

      await AuditLog.create({
        timestamp: new Date(),
        operation: `Requested blood type ${bloodType} not available and no suitable alternatives by user ${user.username}`,
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

    await AuditLog.create({
      timestamp: new Date(),
      operation: `Requested ${amount} units of blood type ${bloodType} by user ${user.username}`,
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

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;
    const user = await User.findByPk(userId);

    console.log(
      `Requesting ${amount} units of blood type ${bloodType} in emergency`
    );

    const inventory = await BloodInventory.findOne({ where: { bloodType } });

    if (!inventory || inventory.amount < amount) {
      console.log(
        "No inventory found for this blood type or not enough blood in inventory"
      );

      await AuditLog.create({
        timestamp: new Date(),
        operation: `Requested blood type ${bloodType} not available in emergency by user ${user.username}`,
      });

      return res.status(200).json({
        message:
          "Requested blood type not available and no suitable alternatives in emergency",
      });
    }

    inventory.amount -= amount;
    await inventory.save();

    await AuditLog.create({
      timestamp: new Date(),
      operation: `Requested ${amount} units of blood type ${bloodType} in emergency by user ${user.username}`,
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

const downloadLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-disposition": "attachment;filename=audit_logs.pdf",
        })
        .end(pdfData);
    });

    doc.fontSize(18).text("Audit Logs", { align: "center" });
    doc.moveDown();

    logs.forEach((log, index) => {
      const timestamp = log.timestamp
        ? log.timestamp.toISOString()
        : "Unknown time";
      const operation = log.operation || "Unknown operation";

      doc
        .fontSize(12)
        .text(`${index + 1}. ${timestamp}: ${operation}`, {
          align: "left",
        })
        .moveDown();
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

module.exports = {
  addDonation,
  requestBlood,
  requestBloodEmergency,
  getBloodInventory,
  downloadLogs,
};
