const bcrypt = require("bcrypt");
const { User } = require("../models");

const addUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      isAdmin: role.isAdmin,
      isRegularUser: role.isRegularUser,
      isResearchStudent: role.isResearchStudent,
      mustChangePassword: true,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

module.exports = {
  addUser,
};
