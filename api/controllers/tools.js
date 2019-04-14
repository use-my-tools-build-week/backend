const express = require('express');

const Tool = require('../models/Tool');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId },
    body: tool
  } = req;

  if (tool.name) {
    try {
      const saved = await Tool.insert({
        ...tool,
        user_id: currentUserId
      });

      return res.status(201).json(saved);
    } catch (error) {
      if (
        error.message &&
        error.message.includes('SQLITE_CONSTRAINT: UNIQUE')
      ) {
        return res.status(409).json({ message: 'Name must be unique.' });
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

  const tools = search
    ? await Tool.findByName(search)
    : await Tool.find();
  return res.status(200).json(tools);
});
module.exports = router;
