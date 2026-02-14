const express = require('express');
const Visitor = require('../models/Visitor');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const CareTip = require('../models/CareTip');
const Order = require('../models/Order');

const router = express.Router();

router.post('/log-visit', async (req, res) => {
  try {
    const { email, name } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await Visitor.findOneAndUpdate(
      { email: email || 'Guest', name: name || 'Anonymous' },
      { ip, userAgent, lastVisit: Date.now() },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

async function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });

  // BYPASS FOR LOCAL DEVELOPMENT / FALLBACK LOGIN
  if (parts[1].startsWith('dummy-token-')) {
    req.user = { role: 'admin' };
    return next();
  }

  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || 'secret');
    console.log('AuthAdmin Payload:', payload);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const u = await User.findById(payload.id);
    if (!u) {
      console.log('Admin user not found in DB:', payload.id);
      return res.status(403).json({ error: 'Access denied: User not found' });
    }
    if (u.isBlocked) {
      console.log('Admin user is blocked:', u.email);
      return res.status(403).json({ error: 'Access denied: User blocked' });
    }
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// list users (no passwords)
router.get('/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List recent visitors
router.get('/visitors', authAdmin, async (req, res) => {
  try {
    const data = await Visitor.find().sort({ lastVisit: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});


// delete user and their cart
router.delete('/users/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Cart.findOneAndDelete({ user: id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// toggle block status
router.post('/users/:id/toggle-block', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Toggle block request for ID:', id);
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot block an admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    console.log(`User ${user.email} is now ${user.isBlocked ? 'blocked' : 'unblocked'}`);
    res.json({ ok: true, isBlocked: user.isBlocked });
  } catch (err) {
    console.error('Toggle Block Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// toggle block status by email
router.post('/users/block-by-email', authAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot block an admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ ok: true, isBlocked: user.isBlocked, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PLANT MANAGEMENT ---

// Create Plant
router.post('/plants', authAdmin, async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const newPlant = new Plant({
      name,
      category,
      price,
      description,
      image,
      discountPrice: Math.round(price * 0.8) // auto calc discount for now
    });
    await newPlant.save();
    const io = req.app.get('io');
    if (io) io.emit('plants_updated');
    res.json(newPlant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Plant
router.put('/plants/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // recalculate discount if price changes
    if (updates.price) {
      updates.discountPrice = Math.round(updates.price * 0.8);
    }
    const updated = await Plant.findByIdAndUpdate(id, updates, { new: true });
    const io = req.app.get('io');
    if (io) io.emit('plants_updated');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Plant
router.delete('/plants/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    const io = req.app.get('io');
    if (io) io.emit('plants_updated');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- CARE TIPS MANAGEMENT ---

// Create Care Tip
router.post('/care-tips', authAdmin, async (req, res) => {
  try {
    const { title, category, description, image } = req.body;
    const newTip = new CareTip({
      title,
      category,
      description,
      image
    });
    await newTip.save();
    res.json(newTip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Care Tip
router.put('/care-tips/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await CareTip.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Care Tip
router.delete('/care-tips/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await CareTip.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- ORDER MANAGEMENT ---

// List all orders (Admin)
router.get('/orders', authAdmin, async (req, res) => {
  try {
    // Populate user details to show who ordered
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Order Status
router.put('/orders/:id/status', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Pending', 'Shipped', etc.

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });

    console.log(`Order ${id} status updated to ${status}`);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
