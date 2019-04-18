const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Category = require('../models/Category');
const Condition = require('../models/Condition');
const LoanRequest = require('../models/LoanRequest');
const Favorite = require('../models/Favorite');
const { generateToken, authenticate } = require('../middleware/authenticate');
const uniqueCheck = require('./validators/uniqueCheck');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom(uniqueCheck(User, 'email')),
    body('password').isLength({ min: 5 }),
    body('username')
      .optional()
      .not()
      .isEmpty()
      .trim()
      .custom(uniqueCheck(User, 'username'))
  ],
  async (req, res) => {
    const user = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    user.password = bcrypt.hashSync(user.password, 8);

    try {
      const { password: omit, ...saved } = await User.insert(user);
      const token = generateToken(saved);

      return res.status(201).json({ ...saved, token });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('')
      .not()
      .isEmpty()
      .trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    try {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        const { password: omit, ...userWithoutPassword } = user;

        const asLoaner = await LoanRequest.find().where({ loaner_id: user.id });
        const asBorrower = await LoanRequest.find().where({ user_id: user.id });
        return res.status(200).json({
          ...userWithoutPassword,
          token,
          categories: await Category.find(),
          conditions: await Condition.find(),
          loan_requests: { toMe: asLoaner, fromMe: asBorrower },
          favorites: await Favorite.find().where({
            'favorites.user_id': user.id
          })
        });
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid credentials.' }] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.get('/my_info', authenticate, async (req, res) => {
  try {
    const {
      decoded: { subject: currentUserId }
    } = req;

    const user = await User.findById(currentUserId);

    const asLoaner = await LoanRequest.find().where({ loaner_id: user.id });
    const asBorrower = await LoanRequest.find().where({ user_id: user.id });
    const { password: omit, ...userWithoutPassword } = user;
    return res.status(200).json({
      ...userWithoutPassword,
      categories: await Category.find(),
      conditions: await Condition.find(),
      loan_requests: { toMe: asLoaner, fromMe: asBorrower },
      favorites: await Favorite.find().where({ 'favorites.user_id': user.id })
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
