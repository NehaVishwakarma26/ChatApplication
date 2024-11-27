const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the current user
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Fetch all users except the logged-in user (for Sidebar)
router.get('/users', async (req, res) => {
  try {
    // Fetch all users except the logged-in user
    const loggedInUserId = req.query.loggedInUserId;  // Get logged-in user ID from the query
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select('username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch username by user ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params; // The user ID in the URL parameter
  try {
    const user = await User.findById(id).select('username');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username }); // Only return the username
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
