const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateToken } = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', async (req, res) => {
  const user = req.body;

  if (user.username && user.password && user.email) {
    user.password = bcrypt.hashSync(user.password, 8);
    const token = generateToken(user);

    try {
      const saved = await User.insert(user);

      return res.status(201).json({ ...saved, token });
    } catch (error) {
      if (
        error.message &&
        error.message.includes('SQLITE_CONSTRAINT: UNIQUE')
      ) {
        return res
          .status(409)
          .json({ message: 'Username and Email must be unique.' });
      }

      return res.status(500).json(error);
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Please provide username, email, and password' });
  }
});

module.exports = router;
