const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const uri = 'mongodb://localhost:27017/greenie';

async function audit() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const outdoor = await Plant.find({ category: { $regex: /outdoor/i } });
        console.log('--- OUTDOOR PLANTS ---');
        outdoor.forEach(p => console.log(`${p.name} - ₹${p.price} (Off: ${p.price - p.discountPrice})`));
        console.log(`Total Outdoor: ${outdoor.length}`);

        const others = await Plant.find({ category: { $not: { $regex: /outdoor/i } } });
        console.log('--- OTHER PLANTS ---');
        console.log(`Total Others: ${others.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

audit();
