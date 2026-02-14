require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Plant = require('./models/Plant');
const Cart = require('./models/Cart');

async function seedCart() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI not set');
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // 1. Find a user
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            // check if any user exists
            user = await User.findOne({});
        }

        // If absolutely no user, create one
        if (!user) {
            console.log('No user found, creating a test user...');
            user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedpassword123', // Dummy password
                role: 'user'
            });
        }
        console.log(`Using user: ${user.email} (${user._id})`);

        // 2. Find a plant
        const plant = await Plant.findOne({});
        if (!plant) {
            console.log('No plants found! Please ensure plants are seeded first.');
            process.exit(0);
        }
        console.log(`Adding plant: ${plant.name} (${plant._id})`);

        // 3. Update/Create Cart
        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            console.log('Creating new cart...');
            cart = new Cart({ user: user._id, items: [] });
        } else {
            console.log('Updating existing cart...');
        }

        // Add item
        const existingItem = cart.items.find(item => item.plant.toString() === plant._id.toString());
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.items.push({ plant: plant._id, qty: 1 });
        }

        await cart.save();
        console.log('Cart updated successfully!');
        console.log('Current Cart Items:', JSON.stringify(cart.items, null, 2));

    } catch (err) {
        console.error('Error seeding cart:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedCart();
