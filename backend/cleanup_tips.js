const mongoose = require('mongoose');
const CareTip = require('./models/CareTip');

const uri = 'mongodb://localhost:27017/greenie';

async function cleanup() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Delete tips that look like seeded ones
        // Examples: "Watering Tip #1", "Fertilizing Tip #2", etc.
        const result = await CareTip.deleteMany({
            $or: [
                { title: /Tip #\d+/ },
                { description: /Essential advice for/ }
            ]
        });

        console.log(`Deleted ${result.deletedCount} generic care tips.`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

cleanup();
