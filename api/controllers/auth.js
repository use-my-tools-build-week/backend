const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateToken } = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', async (req, res) => {
  const user = req.body;

  if (user.username && user.password && user.email) {
    user.password = bcrypt.hashSync(user.password, 8);

    try {
      const saved = await User.insert(user);
      const token = generateToken(saved);

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
      .json({ message: 'Please provide username, email, and password.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const user = await User.findByUsername(username);
    try {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ message: 'Username and password required.' });
  }
});

module.exports = router;
