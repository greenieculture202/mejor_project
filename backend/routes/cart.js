const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');

const router = express.Router();

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || 'secret');
    const u = await User.findById(payload.id);
    if (!u || u.isBlocked) return res.status(403).json({ error: 'Account blocked or not found' });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(auth);

router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.plant');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { plantId, qty = 1 } = req.body;
    if (!plantId) return res.status(400).json({ error: 'plantId required' });
    const plant = await Plant.findById(plantId);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    const existing = cart.items.find((it) => it.plant.toString() === plantId.toString());
    if (existing) existing.qty = Math.max(1, existing.qty + qty);
    else cart.items.push({ plant: plantId, qty });
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter((it) => it.plant.toString() !== plantId.toString());
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
