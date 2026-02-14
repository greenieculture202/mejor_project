const mongoose = require('mongoose');
const CareTip = require('./models/CareTip');

const uri = 'mongodb://localhost:27017/greenie';

async function run() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        // 1. Delete the generic "Tip #" entries I added
        // Regex matches "Tip #" followed by digits
        const result = await CareTip.deleteMany({ title: { $regex: /Tip #\d+/ } });
        console.log(`Deleted ${result.deletedCount} generic 'Tip #' entries.`);

        // 2. Check what's left
        const remaining = await CareTip.find();
        console.log(`Remaining Care Tips: ${remaining.length}`);
        remaining.forEach(t => console.log(` - ${t.title}`));

        // 3. If too few, add high-quality named ones (not numbered)
        if (remaining.length < 5) {
            console.log("Restoring default high-quality tips...");
            const qualitySamples = [
                { title: 'Watering Basics', category: 'Watering', description: 'Learn the fundamentals of watering your plants.', image: 'assets/bg1.jpg' },
                { title: 'Deep Watering Technique', category: 'Watering', description: 'How to water deeply for healthy roots.', image: 'assets/bg2.avif' },
                { title: 'Fertilizer Types', category: 'Fertilizing', description: 'Different fertilizers and when to use them.', image: 'assets/bg3.jpg' },
                { title: 'Organic Fertilizers', category: 'Fertilizing', description: 'Natural options for plant nutrition.', image: 'assets/bg4.jpg' },
                { title: 'Pruning Tools', category: 'Pruning', description: 'Essential tools for proper pruning.', image: 'assets/bg1.jpg' },
                { title: 'When to Prune', category: 'Pruning', description: 'Best times to prune different plants.', image: 'assets/bg2.avif' },
                { title: 'Pest Identification', category: 'Pest Control', description: 'How to spot common houseplant pests early.', image: 'assets/bg3.jpg' },
                { title: 'Neem Oil Usage', category: 'Pest Control', description: 'Using neem oil safely and effectively.', image: 'assets/bg4.jpg' }
            ];
            // Only insert ones that don't exist by title
            for (const q of qualitySamples) {
                const exists = await CareTip.findOne({ title: q.title });
                if (!exists) {
                    await CareTip.create(q);
                    console.log(`Added: ${q.title}`);
                }
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
