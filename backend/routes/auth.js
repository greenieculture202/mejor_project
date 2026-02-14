const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// WARNING: This route stores and compares plaintext passwords, per current instructions.
// DO NOT use this configuration in any production or real-user environment.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) {
      if (exists.isBlocked) {
        return res.status(403).json({ error: 'This email is blocked. Registration is not allowed.' });
      }
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Store plaintext password directly.
    const u = new User({ name, email, password, phone, address, role });
    await u.save();
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: u._id, email: u.email, name: u.name, phone: u.phone, address: u.address, role: u.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ error: 'Invalid credentials' });

    // Plaintext comparison
    if (u.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (u.isBlocked) return res.status(403).json({ error: 'Your account has been blocked by the admin.' });
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: u._id, email: u.email, name: u.name, phone: u.phone, address: u.address, role: u.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/status', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const u = await User.findById(payload.id);
    if (!u || u.isBlocked) {
      return res.status(403).json({ isBlocked: true, error: 'User is blocked or not found' });
    }
    res.json({ isBlocked: false, user: { id: u._id, email: u.email, name: u.name, role: u.role } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


module.exports = router;
