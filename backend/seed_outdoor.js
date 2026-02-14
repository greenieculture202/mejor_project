const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const uri = 'mongodb://localhost:27017/greenie';

const outdoorPlants = [
    {
        name: "Bougainvillea Spectabilis",
        price: 349,
        image: "https://images.unsplash.com/photo-1599598425947-d3527b7ab9f5?auto=format&fit=crop&w=800&q=80",
        description: "Vibrant, low-maintenance climber that loves full sun and blooms profusely."
    },
    {
        name: "Hibiscus Rosa-sinensis",
        price: 299,
        image: "https://images.unsplash.com/photo-1590236162354-949397669d6c?auto=format&fit=crop&w=800&q=80",
        description: "Tropical beauty with large, colorful flowers perfect for sunny gardens."
    },
    {
        name: "Jasmine (Mogra)",
        price: 249,
        image: "https://images.unsplash.com/photo-1596726608552-32b49b38038c?auto=format&fit=crop&w=800&q=80",
        description: "Known for its intensely fragrant white flowers and climbing habit."
    },
    {
        name: "Aloe Vera",
        price: 199,
        image: "https://images.unsplash.com/photo-1628135899980-0a2a4b87588e?auto=format&fit=crop&w=800&q=80",
        description: "Hardy succulent known for its medicinal gel and drought tolerance."
    },
    {
        name: "Holy Basil (Tulsi)",
        price: 149,
        image: "https://images.unsplash.com/photo-1616782522646-e571e72ce9f1?auto=format&fit=crop&w=800&q=80",
        description: "Sacred plant with aromatic leaves, essential for herbal tea and wellness."
    },
    {
        name: "Curry Leaf Plant",
        price: 129,
        image: "https://images.unsplash.com/photo-1634892404393-79d854df1132?auto=format&fit=crop&w=800&q=80",
        description: "Aromatic leaves that add authentic flavor to your culinary dishes."
    },
    {
        name: "Rose Plant (Red)",
        price: 399,
        image: "https://images.unsplash.com/photo-1554504106-a88981c2f254?auto=format&fit=crop&w=800&q=80",
        description: "Classic symbol of love, offering stunning blooms and fragrance."
    },
    {
        name: "Lavender",
        price: 499,
        image: "https://images.unsplash.com/photo-1592186790933-294713c72b83?auto=format&fit=crop&w=800&q=80",
        description: "Fragrant purple blooms that attract bees and butterflies."
    },
    {
        name: "Chrysanthemum",
        price: 299,
        image: "https://images.unsplash.com/photo-1569348332159-8693cebe7856?auto=format&fit=crop&w=800&q=80",
        description: "Bright, cheerful flowers that bloom in abundance during the season."
    },
    {
        name: "Jade Plant",
        price: 399,
        image: "https://images.unsplash.com/photo-1574768560824-c8c3653199c0?auto=format&fit=crop&w=800&q=80",
        description: "Symbol of good luck and prosperity, suitable for sunny spots."
    }
];

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Remove existing Outdoor Plants (Case Insensitive) to clean up old junk data
        const deleteResult = await Plant.deleteMany({ category: { $regex: /outdoor/i } });
        console.log(`Deleted ${deleteResult.deletedCount} existing Outdoor Plants (cleaned up).`);

        const plantsToInsert = outdoorPlants.map(p => {
            // Random discount 5-25%
            const discountPercent = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
            const discountPrice = Math.round(p.price * (1 - discountPercent / 100));

            return {
                ...p,
                discountPrice,
                category: 'Outdoor Plant',
                createdAt: new Date()
            };
        });

        await Plant.insertMany(plantsToInsert);
        console.log(`Successfully seeded ${plantsToInsert.length} unique Outdoor Plants.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
