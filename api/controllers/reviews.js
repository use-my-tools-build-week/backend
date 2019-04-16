const express = require('express');
const {
  oneOf,
  body,
  param,
  validationResult
} = require('express-validator/check');

const Review = require('../models/Review');
const { authenticate } = require('../middleware/authenticate');
const uniqueCheck = require('./validators/uniqueCheck');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('tool_id')
      .not()
      .isEmpty()
      .isInt()
  ],
  oneOf(
    [
      body('message')
        .not()
        .isEmpty()
        .trim(),
      body('score')
        .not()
        .isEmpty()
        .toInt()
    ],
    'Requires at least one of [message, score] to be present]'
  ),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: review
    } = req;

    try {
      const saved = await Review.insert({
        ...review,
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

  const reviews = search
    ? await Review.findByName(search)
    : await Review.find();
  return res.status(200).json(reviews);
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
    const review = await Review.findById(id);
    if (review) {
      return res.status(200).json(review);
    } else {
      return res.status(404).json({ errors: [{ msg: 'Review not found' }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

router.put(
  '/:id',
  authenticate,
  [
    body('tool_id')
      .not()
      .isEmpty()
      .isInt()
  ],
  oneOf(
    [
      body('message')
        .not()
        .isEmpty()
        .trim(),
      body('score')
        .not()
        .isEmpty()
        .toInt()
    ],
    'Requires at least one of [message, score] to be present]'
  ),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      params: { id }
    } = req;

    const review = await Review.findById(id);

    if (currentUserId !== review.user_id) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
    }

    try {
      const updatedReview = await Review.update(id, req.body);
      return res.status(200).json(updatedReview);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

router.delete('/:id', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId },
    params: { id }
  } = req;

  const review = await Review.findById(id);

  if (currentUserId !== review.user_id) {
    return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
  }

  try {
    await Review.remove(id);
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;
