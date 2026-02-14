const express = require('express');
const CareTip = require('../models/CareTip');

const router = express.Router();

// Get care tips; seed if empty
router.get('/', async (req, res) => {
    try {
        const count = await CareTip.countDocuments();
        if (count === 0) {
            const sample = [
                { title: 'Watering Basics', category: 'Watering', description: 'Learn the fundamentals of watering your plants.', image: 'assets/bg1.jpg' },
                { title: 'Deep Watering Technique', category: 'Watering', description: 'How to water deeply for healthy roots.', image: 'assets/bg2.avif' },
                { title: 'Fertilizer Types', category: 'Fertilizing', description: 'Different fertilizers and when to use them.', image: 'assets/bg3.jpg' },
                { title: 'Organic Fertilizers', category: 'Fertilizing', description: 'Natural options for plant nutrition.', image: 'assets/bg4.jpg' },
                { title: 'Pruning Tools', category: 'Pruning', description: 'Essential tools for proper pruning.', image: 'assets/bg1.jpg' },
                { title: 'When to Prune', category: 'Pruning', description: 'Best times to prune different plants.', image: 'assets/bg2.avif' }
            ];
            await CareTip.insertMany(sample);
        }
        const tips = await CareTip.find().sort({ createdAt: -1 });
        res.json(tips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
