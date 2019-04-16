const express = require('express');
const { body, param, validationResult } = require('express-validator/check');

const LoanRequest = require('../models/LoanRequest');
const Tool = require('../models/Tool');
const { authenticate } = require('../middleware/authenticate');
const dbExistenceCheck = require('./validators/dbExistenceCheck');

const router = express.Router();

const doesNotReferenceSelf = (value, { req }) => {
  const {
    decoded: { subject: borrowerId }
  } = req;

  return borrowerId !== value;
};

router.post(
  '/',
  authenticate,
  [
    body('message')
      .optional()
      .trim(),
    body('tool_id')
      .isNumeric()
      .custom(dbExistenceCheck(Tool, 'id')),
    body('loaner_id')
      .isNumeric()
      .custom(doesNotReferenceSelf)
      .withMessage('loaner_id must not reference self')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: loanRequest
    } = req;

    try {
      const saved = await LoanRequest.insert({
        ...loanRequest,
        user_id: currentUserId
      });

      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.put(
  '/:id',
  authenticate,
  [param('id').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      params: { id },
      decoded: { subject: currentUserId },
      body: { message }
    } = req;

    const loanRequest = await LoanRequest.findById(id);

    if (loanRequest.user_id !== currentUserId) {
      return res
        .status(422)
        .json({ errors: [{ msg: 'Resource must belong to current user' }] });
    }

    if (loanRequest.status !== 'pending') {
      return res
        .status(422)
        .json({ errors: [{ msg: 'Can only update LoanRequests with pending status' }] });
    }

    try {
      const updatedLoanRequest = await LoanRequest.update(id, { message: message || "" });
      return res.status(200).json(updatedLoanRequest);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

router.delete(
  '/:id',
  authenticate,
  [param('id').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      params: { id },
      decoded: { subject: currentUserId }
    } = req;

    const loanRequest = await LoanRequest.findById(id);

    if (loanRequest.user_id !== currentUserId) {
      return res
        .status(422)
        .json({ errors: [{ msg: 'Resource must belong to current user' }] });
    }

    try {
      await LoanRequest.remove(id);
      return res.status(200).json(loanRequest);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

module.exports = router;
