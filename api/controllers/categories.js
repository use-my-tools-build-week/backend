const express = require('express');
const { body, validationResult } = require('express-validator/check');

const Category = require('../models/Category');
const { authenticate } = require('../middleware/authenticate');
const uniqueCheck = require('./validators/uniqueCheck');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('name')
      .not()
      .isEmpty()
      .trim()
      .custom(uniqueCheck(Category, 'name'))
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: category
    } = req;

    try {
      const saved = await Category.insert({
        ...category,
        user_id: currentUserId
      });

      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.get('/', async (req, res) => {
  const {
    query: { search }
  } = req;

  try {
    const categories = search
      ? await Category.findByName(search)
      : await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

module.exports = router;
