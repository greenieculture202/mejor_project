const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const uri = 'mongodb://localhost:27017/greenie';

async function clean() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Delete specific junk
        const res1 = await Plant.deleteMany({ name: { $in: [/nikita/i, /radha/i] } });
        console.log(`Deleted ${res1.deletedCount} items matching nikita/radha`);

        // Delete generic "ZZ Plant 8", "Pothos 9" type stuff if needed, but let's stick to the request
        // Actually, user wants outdoor plants *replaced*.
        // Let's ensure NO "outdoor" plants exist that aren't our new ones.
        // But we just seeded 10 new ones. 
        // Wait, did the previous seed add them ON TOP of the old ones?
        // check_db output will tell us.

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

clean();
