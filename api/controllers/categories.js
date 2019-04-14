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
        error.message.match(/unique/i)
      ) {
        return res
          .status(409)
          .json({ message: 'Name must be unique.' });
      }

      return res.status(500).json(error);
    }
  } else {
    return res.status(401).json({ message: 'Please provide name.' });
  }
});

router.get('/', async (req, res) => {
  const {
    query: { search }
  } = req;

  const categories = search
    ? await Category.findByName(search)
    : await Category.find();
  return res.status(200).json(categories);
});

module.exports = router;
