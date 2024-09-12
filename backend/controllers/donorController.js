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

  //server-side validation of donor_id
  const donorIdPattern = /^[0-9]{9}$/; //regular expresiion for only 9 digits

  if (!donorIdPattern.test(donor_id)) {
    return res
      .status(400)
      .json({ message: "Donor ID must be exactly 9 digits" });
  }

  //check if this donor id already exists
  const existing = await Donor.findOne({ where: { donor_id } });

  if (existing) {
    return res.status(400).json({ message: "This Donor ID already exist" });
  }

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
