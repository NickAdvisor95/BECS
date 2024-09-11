const { Donor } = require("../models"); // import model donor

const addDonor = async (req, res) => {
  const {
    donorFirstName,
    donorLastName,
    donor_id,
    bloodType,
    birthdayDonor,
    medicalHistory,
    insurance,
    email,
  } = req.body;

  try {
    // create new donor
    const newDonor = await Donor.create({
      donorFirstName,
      donorLastName,
      donor_id,
      bloodType,
      birthdayDonor,
      medicalHistory,
      insurance,
      email,
    });

    // send respronse to client
    res.status(201).json(newDonor);
  } catch (error) {
    console.error("Error adding donor:", error);
    res.status(500).json({ error: "Error adding donor" });
  }
};

module.exports = {
  addDonor,
};
