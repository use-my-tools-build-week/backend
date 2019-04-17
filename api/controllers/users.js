const express = require('express');
const router = express.Router();
const {param, validationResult } = require('express-validator/check');

const User = require('../models/User');
const { authenticate } = require('../middleware/authenticate');

router.get('/', async (req, res) => {
  try {
    const {
      query: { page, limit }
    } = req;
    const users = await User.find().paginate(limit, page);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', [param('id').isNumeric()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    params: { id }
  } = req;
  try {
    const { password: omit, ...user } = await User.findById(id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put(
  '/update_profile',
  authenticate,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId }
    } = req;

    try {
      const { password, ...updatedUser } = await User.update(
        currentUserId,
        req.body
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
