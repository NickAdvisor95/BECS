const { Donor } = require("../models"); // import model donor

const addDonor = async (req, res) => {
  const {
    firstName,
    lastName,
    passport_Id,
    blood_type,
    birth_date,
    health_condition,
    insurance,
    email,
  } = req.body;

  try {
    // create new donor
    const newDonor = await Donor.create({
      firstName,
      lastName,
      passport_Id,
      blood_type,
      birth_date,
      health_condition,
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
