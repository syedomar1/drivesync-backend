// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { emailOrPhone, password, role } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone, password, role });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ideally, you would use JWT or some other token mechanism
    res.json({ message: 'Logged in successfully', username: user.emailOrPhone, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
