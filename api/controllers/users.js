const express = require('express');

const User = require('../models/User');

const router = express.Router();

const { authenticate } = require('../middleware/authenticate');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId },
    params: { id }
  } = req;

  if (currentUserId !== id) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const updatedUser = await User.update(id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
