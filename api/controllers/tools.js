const express = require('express');
const { body, param, validationResult } = require('express-validator/check');

const Tool = require('../models/Tool');
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
      .custom(uniqueCheck(Tool, 'name'))
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      decoded: { subject: currentUserId },
      body: tool
    } = req;

    try {
      const saved = await Tool.insert({
        ...tool,
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

  const tools = search ? await Tool.findByName(search) : await Tool.find();
  return res.status(200).json(tools);
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
    const tool = await Tool.findById(id);
    if (tool) {
      return res.status(200).json(tool);
    } else {
      return res.status(404).json({ errors: [{ msg: 'Tool not found' }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
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
      decoded: { subject: currentUserId },
      params: { id }
    } = req;

    const tool = await Tool.findById(id);

    if (currentUserId !== tool.user_id) {
      return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
    }

    try {
      const updatedTool = await Tool.update(id, req.body);
      return res.status(200).json(updatedTool);
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

  const tool = await Tool.findById(id);

  if (currentUserId !== tool.user_id) {
    return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
  }

  try {
    await Tool.remove(id);
    return res.status(200).json(tool);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;
