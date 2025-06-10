const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    // Gunakan 401 untuk semua kesalahan autentikasi agar tidak bocor informasi
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
        username: user.username,
        emp_id: user.emp_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      name: user.name,
      role: user.role,
      emp_id: user.emp_id,
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
