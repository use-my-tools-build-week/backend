const express = require('express');
const { body, validationResult } = require('express-validator/check');

const Condition = require('../models/Condition');
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
      .custom(uniqueCheck(Condition, 'name'))
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: condition
    } = req;

    try {
      const saved = await Condition.insert({
        ...condition,
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
    const conditions = search
      ? await Condition.findByName(search)
      : await Condition.find();
    return res.status(200).json(conditions);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

module.exports = router;
