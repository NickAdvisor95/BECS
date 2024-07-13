const { BloodDonation, Donor } = require("../models"); // import models
const { sendEmail } = require("../services/emailService"); // import function sendEmail

const addDonation = async (req, res) => {
  const { donor_id, donation_type, donationDate } = req.body;

  try {
    // create new donation
    const newDonation = await BloodDonation.create({
      donor_id,
      donation_type,
      donationDate,
    });

    // response
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Error adding donation" });
  }
};

const useDonation = async (req, res) => {
  const { donation_id } = req.body;

  try {
    // when its donation will be used is_used in db will be true
    const [updated] = await BloodDonation.update(
      { is_used: true },
      { where: { id: donation_id }, returning: true }
    );

    if (updated) {
      const donation = await BloodDonation.findByPk(donation_id);
      const donor = await Donor.findByPk(donation.donor_id);

      if (donor) {
        const email = donor.email;
        const subject = "Your blood donation was used!";
        const text =
          "Dear donor, your blood donation has been used to save a life. Thank you for your contribution!";
        sendEmail(email, subject, text);
      }

      res.status(200).json(donation);
    } else {
      res.status(404).json({ error: "Donation not found" });
    }
  } catch (error) {
    console.error("Error using donation:", error);
    res.status(500).json({ error: "Error using donation" });
  }
};

module.exports = {
  addDonation,
  useDonation,
};
