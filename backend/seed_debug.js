const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const CareTip = require('./models/CareTip');

// Model for Care Tips (guessing schema if not found, but likely simpler)
// If models/CareTip.js exists I should use it, but I'll define inline for safety or check file first.
// Actually, let's just check Plants first.

const uri = 'mongodb://localhost:27017/greenie';

async function run() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        const count = await Plant.countDocuments();
        console.log(`Current Plant Count: ${count}`);

        if (count === 0) {
            console.log('Seeding 40 Plants...');
            const sample = [];
            const baseNames = ['Areca Palm', 'Snake Plant', 'ZZ Plant', 'Pothos', 'Rubber Plant', 'Fiddle Leaf', 'Peace Lily', 'Jasmine', 'Hibiscus', 'Rose', 'Bougainvillea', 'Money Plant', 'Fern', 'Philodendron', 'Dracaena'];
            const images = ['assets/bg1.jpg', 'assets/bg2.avif', 'assets/bg3.jpg', 'assets/bg4.jpg'];
            const categories = ['Indoor Plant', 'Outdoor Plant', 'Flowering Plant', 'Trending Plant'];
            let id = 1;
            const indoorPlants = [
                { name: "Snake Plant Laurentii", price: 499, discountPrice: 399, image: "https://images.unsplash.com/photo-1599598425947-d3527b7ab9f5?auto=format&fit=crop&w=800&q=80", description: "Hardy and air-purifying." },
                { name: "Monstera Deliciosa", price: 899, discountPrice: 750, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80", description: "The iconic Swiss Cheese Plant." },
                { name: "Fiddle Leaf Fig", price: 1299, discountPrice: 999, image: "https://images.unsplash.com/photo-1617173944883-663267ab57ec?auto=format&fit=crop&w=800&q=80", description: "Large, glossy, violin-shaped leaves." },
                { name: "Peace Lily Sensation", price: 649, discountPrice: 599, image: "https://images.unsplash.com/photo-1593691509543-c55ce62e0ad1?auto=format&fit=crop&w=800&q=80", description: "Elegant white blooms." },
                { name: "Rubber Plant Burgundy", price: 599, discountPrice: 450, image: "https://images.unsplash.com/photo-1611211232932-da3113c5b960?auto=format&fit=crop&w=800&q=80", description: "Thick, glossy dark leaves." },
                { name: "ZZ Plant", price: 449, discountPrice: 399, image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80", description: "Low-maintenance and thrives in low light." },
                { name: "Areca Palm", price: 799, discountPrice: 650, image: "https://images.unsplash.com/photo-1612361738299-8dcb7b1f137d?auto=format&fit=crop&w=800&q=80", description: "Feathery arches of green." },
                { name: "Pothos Golden", price: 299, discountPrice: 249, image: "https://images.unsplash.com/photo-1598585244670-45d6569eb2bd?auto=format&fit=crop&w=800&q=80", description: "Fast-growing trailing plant." },
                { name: "Spider Plant", price: 349, discountPrice: 299, image: "https://images.unsplash.com/photo-1572688484279-a27d5ba2c35a?auto=format&fit=crop&w=800&q=80", description: "Known for its spiderettes." },
                { name: "Bird of Paradise", price: 1599, discountPrice: 1350, image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80", description: "Bring the jungle home." }
            ];

            categories.forEach((cat, ci) => {
                if (cat === 'Indoor Plant') {
                    indoorPlants.forEach(p => {
                        sample.push({
                            ...p,
                            category: cat,
                            createdAt: new Date()
                        });
                        id++;
                    });
                } else {
                    for (let i = 0; i < 10; i++) {
                        const base = baseNames[(ci * 10 + i) % baseNames.length];
                        const price = 299 + ((i * 53 + ci * 41) % 700);
                        const imgUrl = images[(ci + i) % images.length];

                        sample.push({
                            name: `${base} ${i + 1}`,
                            category: cat,
                            description: `Premium ${cat.toLowerCase()} for your home.`,
                            price,
                            discountPrice: Math.round(price * 0.8),
                            image: imgUrl,
                            createdAt: new Date()
                        });
                        id++;
                    }
                }
            });
            await Plant.insertMany(sample);
            console.log('Seeded 40 Plants successfully.');
        } else {
            console.log('Plants already exist. No action taken.');
        }

        // Check Care Tips
        const careCount = await CareTip.countDocuments();
        console.log(`Current CareTip Count: ${careCount}`);

        if (careCount < 40) {
            console.log('Low care tip count. Seeding more Care Tips...');
            const careSample = [];
            const careCategories = ['Watering', 'Fertilizing', 'Pruning', 'Pest Control'];
            // Create 5 tips per category
            careCategories.forEach(cat => {
                for (let i = 1; i <= 10; i++) {
                    careSample.push({
                        title: `${cat} Tip #${i}`,
                        category: cat,
                        description: `Essential advice for ${cat.toLowerCase()} to keep your plants healthy.`,
                        image: 'assets/bg1.jpg'
                    });
                }
            });

            await CareTip.insertMany(careSample);
            console.log(`Seeded ${careSample.length} Care Tips successfully.`);
        } else {
            console.log('Care Tips already exist.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
