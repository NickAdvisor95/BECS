const express = require("express");
const { login, changePassword, logout } = require("../controllers/authController");
const { addUser } = require("../controllers/userController");
const {
  addDonation,
  getBloodInventory,
  requestBlood,
  requestBloodEmergency,
  downloadLogs,
} = require("../controllers/bloodController");
const { authenticate, isAdmin } = require("../middleware/auth");

const router = express.Router();
const donorController = require("../controllers/donorController");
const { Donor } = require("../models");

router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", authenticate, changePassword);
router.post("/add-user", authenticate, isAdmin, addUser);
router.post("/add-donation", authenticate, addDonation);
router.get("/blood-inventory", authenticate, getBloodInventory);
router.post("/request-blood", authenticate, requestBlood);
router.post("/request-blood-emergency", authenticate, requestBloodEmergency);
router.get("/download-logs", authenticate, isAdmin, downloadLogs);
router.post("/registration-donor", donorController.addDonor);
router.get("/donor/:donor_id", donorController.getDonorById);
// update last_donation_date for donor
router.put("/donors/:donorId/update-last-donation", async (req, res) => {
  try {
    const donorId = req.params.donorId;

    // update last donation date of donor
    await Donor.update(
      { last_donation_date: new Date() }, // set current date
      { where: { donor_id: donorId } }
    );

    res
      .status(200)
      .json({ message: "Last donation date updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update last donation date" });
  }
});

module.exports = router;
