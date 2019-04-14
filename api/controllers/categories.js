const express = require('express');

const Category = require('../models/Category');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId },
    body: category
  } = req;

  if (category.name) {
    try {
      const saved = await Category.insert({
        ...category,
        user_id: currentUserId
      });

      return res.status(201).json(saved);
    } catch (error) {
      if (
        error.message &&
        error.message.includes('SQLITE_CONSTRAINT: UNIQUE')
      ) {
        return res
          .status(409)
          .json({ message: 'Categoryname and Email must be unique.' });
      }

      return res.status(500).json(error);
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Please provide name.' });
  }
});

module.exports = router;
