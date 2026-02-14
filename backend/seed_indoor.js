const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const uri = 'mongodb://localhost:27017/greenie';

const indoorPlants = [
    {
        name: "Snake Plant Laurentii",
        price: 499,
        image: "https://images.unsplash.com/photo-1598516088243-7bb237f3743c?auto=format&fit=crop&w=800&q=80",
        description: "Hardy and air-purifying, the Snake Plant Laurentii is perfect for beginners."
    },
    {
        name: "Monstera Deliciosa",
        price: 899,
        image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
        description: "The iconic Swiss Cheese Plant adds a tropical vibe to any indoor space."
    },
    {
        name: "Fiddle Leaf Fig",
        price: 1299,
        image: "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?auto=format&fit=crop&w=800&q=80",
        description: "A statement piece with large, glossy, violin-shaped leaves."
    },
    {
        name: "Peace Lily Sensation",
        price: 649,
        image: "https://images.unsplash.com/photo-1593691509543-c55ce62e0ad1?auto=format&fit=crop&w=800&q=80",
        description: "Elegant white blooms and lush green foliage that purifies the air."
    },
    {
        name: "Rubber Plant Burgundy",
        price: 599,
        image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=800&q=80",
        description: "Thick, glossy dark leaves make this a striking addition to your decor."
    },
    {
        name: "ZZ Plant",
        price: 449,
        image: "https://plus.unsplash.com/premium_photo-1669740132338-766b039cc2cc?auto=format&fit=crop&w=800&q=80",
        description: "An incredibly low-maintenance plant that thrives in low light."
    },
    {
        name: "Areca Palm",
        price: 799,
        image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=800&q=80",
        description: "Feathery arches of green that act as a natural humidifier."
    },
    {
        name: "Pothos Golden",
        price: 299,
        image: "https://images.unsplash.com/photo-1598585244670-45d6569eb2bd?auto=format&fit=crop&w=800&q=80",
        description: "A fast-growing trailing plant with heart-shaped variegated leaves."
    },
    {
        name: "Spider Plant",
        price: 349,
        image: "https://images.unsplash.com/photo-1616616212581-2287959828d0?auto=format&fit=crop&w=800&q=80",
        description: "Known for its spiderettes and air-cleaning properties."
    },
    {
        name: "Bird of Paradise",
        price: 1599,
        image: "https://images.unsplash.com/photo-1591958911259-b11d310a0e50?auto=format&fit=crop&w=800&q=80",
        description: "Bring the jungle home with large, banana-like leaves."
    }
];

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Remove existing Indoor Plants to avoid duplicates
        const deleteResult = await Plant.deleteMany({ category: 'Indoor Plant' });
        console.log(`Deleted ${deleteResult.deletedCount} existing Indoor Plants.`);

        const plantsToInsert = indoorPlants.map(p => {
            // Random discount 10-35%
            const discountPercent = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
            const discountPrice = Math.round(p.price * (1 - discountPercent / 100));

            return {
                ...p,
                discountPrice,
                category: 'Indoor Plant',
                createdAt: new Date()
            };
        });

        await Plant.insertMany(plantsToInsert);
        console.log(`Successfully seeded ${plantsToInsert.length} unique Indoor Plants with random discounts.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
