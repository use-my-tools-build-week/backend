const express = require('express');
const { body, validationResult, param } = require('express-validator/check');

const Favorite = require('../models/Favorite');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('tool_id')
      .not()
      .isEmpty()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: favorite
    } = req;

    try {
      const favorites = await Favorite.insert({
        ...favorite,
        user_id: currentUserId
      }).then(() => Favorite.findByUserId(currentUserId));

      return res.status(201).json(favorites);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.get('/', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId }
  } = req;
  const favorites = await Favorite.findByUserId(currentUserId);
  return res.status(200).json(favorites);
});

router.delete(
  '/:id',
  [
    param('id')
      .isNumeric()
      .toInt()
  ],
  authenticate,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const {
      decoded: { subject: currentUserId },
      params: { id }
    } = req;

    try {
      const favorite = await Favorite.findById(id).where({user_id: currentUserId});
      if (favorite) {
        await Favorite.remove(id);
        return res.status(200).json(favorite);
      } else {
        return res
          .status(404)
          .json({ errors: [{ msg: 'User favorite does not exist' }] });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

module.exports = router;
