const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const uri = 'mongodb://localhost:27017/greenie';

async function check() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const plants = await Plant.find({});
        console.log(`Total plants: ${plants.length}`);

        const nikita = await Plant.find({ name: /nikita/i });
        console.log('Plants named Nikita:', nikita);

        const radha = await Plant.find({ name: /radha/i });
        console.log('Plants named Radha:', radha);

        const outdoor = await Plant.find({ category: { $regex: /outdoor/i } });
        console.log('Outdoor plants count:', outdoor.length);
        console.log('Outdoor plants names:', outdoor.map(p => p.name));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
