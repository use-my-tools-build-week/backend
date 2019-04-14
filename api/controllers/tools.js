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

router.get('/:id', async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const tool = await Tool.findById(id);
    if (tool) {
      return res.status(200).json(tool);
    } else {
      return res.status(404).json({ message: 'Tool not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const {
    decoded: { subject: currentUserId },
    params: { id }
  } = req;

  const tool = await Tool.findById(id);

  if (currentUserId !== tool.user_id.toString()) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const updatedTool = await Tool.update(id, req.body);
    return res.status(200).json(updatedTool);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
