const { Donor, Notification } = require("../models"); // import models Donor и Notification from folder models
const { sendEmail } = require("../services/emailService"); // import function sendEmail

const sendNotification = async (req, res) => {
  const { donor_id, message } = req.body;

  try {
    // serach donor by id
    const donor = await Donor.findByPk(donor_id);

    if (donor) {
      const email = donor.email;
      const subject = "Notification";
      const text = message;

      // send notification to email
      sendEmail(email, subject, text);

      // add notofication to db
      await Notification.create({ donor_id, message });

      res.status(200).send("Notification sent");
    } else {
      res.status(404).send("Donor not found");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Error sending notification" });
  }
};

module.exports = {
  sendNotification,
};
