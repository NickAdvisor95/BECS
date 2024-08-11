const express = require("express");
const { login, changePassword } = require("../controllers/authController");
const { addUser } = require("../controllers/userController");
const {
  addDonation,
  getBloodInventory,
  requestBlood,
  requestBloodEmergency,
  downloadLogs, // Добавлен маршрут для скачивания логов
} = require("../controllers/bloodController");
const { authenticate, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/change-password", authenticate, changePassword);
router.post("/add-user", authenticate, isAdmin, addUser);
router.post("/add-donation", authenticate, addDonation);
router.get("/blood-inventory", authenticate, getBloodInventory);
router.post("/request-blood", authenticate, requestBlood);
router.post("/request-blood-emergency", authenticate, requestBloodEmergency);
router.get("/download-logs", authenticate, isAdmin, downloadLogs); // Новый маршрут

module.exports = router;
