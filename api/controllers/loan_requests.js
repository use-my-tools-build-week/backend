const express = require('express');
const { body, param, validationResult } = require('express-validator/check');

const LoanRequest = require('../models/LoanRequest');
const Tool = require('../models/Tool');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('message')
      .optional()
      .trim(),
    body('tool_id').isNumeric()
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
      const tool = await Tool.findById(loanRequest.tool_id);

      if (tool.user_id === currentUserId) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'Users cannot self loan.' }] });
      }

      const maybeRequest = await LoanRequest.find().where({
        user_id: currentUserId,
        tool_id: tool.id
      }).first();

      if (maybeRequest) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'Duplicate requests disallowed.' }] });
      }

      const saved = await LoanRequest.insert({
        ...loanRequest,
        loaner_id: tool.user_id,
        user_id: currentUserId
      });

      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

router.get('/my_loan_requests', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId }
  } = req;
  const asLoaner = await LoanRequest.find().where({ loaner_id: currentUserId });
  const asBorrower = await LoanRequest.find().where({ user_id: currentUserId });
  return res.status(200).json({ toMe: asLoaner, fromMe: asBorrower });
});

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
      return res.status(422).json({
        errors: [{ msg: 'Can only update LoanRequests with pending status' }]
      });
    }

    try {
      const updatedLoanRequest = await LoanRequest.update(id, {
        message: message || ''
      });
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
