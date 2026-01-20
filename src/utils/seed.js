const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce_mvc')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create Default User
        const user = await User.create({
            name: 'Ivan Petrov',
            email: 'ivan@example.com',
            age: 30,
            role: 'user'
        });
        console.log('Created User:', user.name);

        // Create Products
        const products = [
            {
                name: 'iPhone 15 Pro',
                price: 999,
                description: 'Titanium design, A17 Pro chip, Action button.',
                stock: 10
            },
            {
                name: 'MacBook Air M3',
                price: 1099,
                description: 'Supercharged by M3, incredibly thin and light.',
                stock: 5
            },
            {
                name: 'AirPods Max',
                price: 549,
                description: 'High-fidelity audio, Active Noise Cancellation.',
                stock: 8
            },
            {
                name: 'Apple Watch Ultra 2',
                price: 799,
                description: 'The most rugged and capable Apple Watch.',
                stock: 3
            },
            {
                name: 'iPad Pro',
                price: 799,
                description: 'The ultimate iPad experience with M4 chip.',
                stock: 7
            }
        ];

        await Product.insertMany(products);
        console.log(`Created ${products.length} products`);

        console.log('Seeding Completed Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
