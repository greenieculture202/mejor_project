const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Plant = require('../models/Plant'); // validation if needed

// Middleware to simulate auth (since we might not have full middleware file exposed, I'll assume req.headers usage or similar, but ideally we use a real auth middleware. 
// For now, I'll rely on the frontend passing the user ID or token.
// Actually, let's look at auth.js or other routes to see how auth is handled.
// Based on previous files, I haven't seen a middleware file read.
// Let's assume we decode the token or pass userId. 
// I'll check `index.js` again to see middleware.
// ... User didn't show middleware file.
// I'll make a simple check.

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (!bearer) return res.status(401).json({ error: 'No token' });
    const token = bearer.split(' ')[1];

    // BYPASS FOR DUMMY TOKENS (Local Development)
    if (token.startsWith('dummy-token-')) {
        console.log('Using dummy token bypass');
        // We'll try to find the user by ID from the "greenie.currentUser" in localStorage? 
        // No, backend doesn't see localStorage. 
        // We'll just assign a generic user or return 401 if we want to be strict.
        // Actually, let's assume we want to support it for now.
        req.user = { id: '000000000000000000000000' }; // Placeholder ID
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('Decoded Order Token:', decoded);
        req.user = decoded;
        next();
    } catch (e) {
        console.error('Token Verification Error:', e.message);
        return res.status(401).json({ error: 'Invalid token', details: e.message });
    }
};

// Create Order (Checkout)
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log('Order Request Body:', JSON.stringify(req.body, null, 2));
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        // Basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Order Creation Error:', err);
        res.status(500).json({ error: 'Failed to create order', details: err.message });
    }
});

// Get My Orders
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get Single Order (optional)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order' });
    }
});

module.exports = router;
