const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.isAdmin ? "admin" : "user" },
      "your_jwt_secret"
    );
    console.log("Login successful. User object:", user.toJSON());
    res.json({ token, mustChangePassword: user.mustChangePassword });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password_hash: hashedPassword,
      mustChangePassword: false,
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  changePassword,
};
