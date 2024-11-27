const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// Fetch chat history between two users
router.get('/', async (req, res) => {
  const { sender, receiver } = req.query;
  if (!sender || !receiver) {
    return res.status(400).json({ message: 'Sender and receiver are required' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 }); // Oldest to newest
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { sender, receiver, content } = req.body;
  if (!sender || !receiver || !content) {
    return res.status(400).json({ message: 'Sender, receiver, and content are required' });
  }

  try {
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
