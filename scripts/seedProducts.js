const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Organic Tomatoes",
        description: "Fresh, locally grown organic tomatoes. Perfect for salads and cooking.",
        price: 20,
        quantity: 100,
        unit: "kg",
        category: "vegetables",
        image: "/images/tomatoes.jpg",
        status: "available"
    },
    {
        name: "Fresh Milk",
        description: "Pure, unprocessed milk from grass-fed cows.",
        price: 50,
        quantity: 50,
        unit: "kg",
        category: "dairy",
        image: "/images/milk.jpg",
        status: "available"
    },
    {
        name: "Organic Wheat",
        description: "High-quality organic wheat, perfect for baking.",
        price: 8,
        quantity: 1000,
        unit: "kg",
        category: "grains",
        image: "/images/wheat.jpg",
        status: "available"
    },
    {
        name: "Fresh Eggs",
        description: "Farm-fresh eggs from free-range chickens.",
        price: 8.00,
        quantity: 200,
        unit: "piece",
        category: "other",
        image: "/images/eggs.jpg",
        status: "available"
    },
    {
        name: "Organic Potatoes",
        description: "Fresh organic potatoes, great for various dishes.",
        price: 10,
        quantity: 200,
        unit: "kg",
        category: "vegetables",
        image: "/images/potatoes.jpg",
        status: "available"
    },
    {
        name: "Basmati Rice",
        description: "Premium quality basmati rice, perfect for biryani and pulao.",
        price: 30,
        quantity: 500,
        unit: "kg",
        category: "grains",
        image: "/images/rice.jpg",
        status: "available"
    },
    {
        name: "Red Lentils",
        description: "High-protein red lentils, great for soups and curries.",
        price: 30,
        quantity: 300,
        unit: "kg",
        category: "other",
        image: "/images/lentils.jpg",
        status: "available"
    },
    // New products
    {
        name: "Bananas",
        description: "Sweet and ripe bananas, perfect for snacking.",
        price: 15,
        quantity: 150,
        unit: "kg",
        category: "fruits",
        image: "/images/bananas.jpg",
        status: "available"
    },
    {
        name: "Apples",
        description: "Crisp and juicy apples, freshly picked.",
        price: 60,
        quantity: 120,
        unit: "kg",
        category: "fruits",
        image: "/images/apples.jpg",
        status: "available"
    },
    {
        name: "Mangoes",
        description: "Delicious, sweet mangoes, the king of fruits.",
        price: 100,
        quantity: 80,
        unit: "kg",
        category: "fruits",
        image: "/images/mangoes.jpg",
        status: "available"
    },
    {
        name: "Grapes",
        description: "Fresh green grapes, perfect for a healthy snack.",
        price: 90,
        quantity: 90,
        unit: "kg",
        category: "fruits",
        image: "/images/grapes.jpg",
        status: "available"
    },
    {
        name: "Corn",
        description: "Sweet corn, great for boiling or grilling.",
        price: 25,
        quantity: 200,
        unit: "kg",
        category: "grains",
        image: "/images/corn.jpg",
        status: "available"
    },
    {
        name: "Barley",
        description: "Nutritious barley grains, ideal for soups and salads.",
        price: 18,
        quantity: 300,
        unit: "kg",
        category: "grains",
        image: "/images/barley.jpg",
        status: "available"
    },
    {
        name: "Oranges",
        description: "Juicy oranges packed with vitamin C.",
        price: 50,
        quantity: 100,
        unit: "kg",
        category: "fruits",
        image: "/images/oranges.jpg",
        status: "available"
    },
    {
        name: "Pineapple",
        description: "Tropical pineapple, sweet and tangy.",
        price: 80,
        quantity: 60,
        unit: "kg",
        category: "fruits",
        image: "/images/pineapple.jpg",
        status: "available"
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-connect', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create a test farmer if none exists
        let farmer = await User.findOne({ role: 'farmer' });
        if (!farmer) {
            farmer = await User.create({
                name: 'Test Farmer',
                email: 'farmer@test.com',
                password: 'password123',
                role: 'farmer',
                address: '123 Farm Lane, Countryside',
                phone: '123-456-7890'
            });
            console.log('Created test farmer account');
        }

        // Add farmer ID to all products
        const productsWithFarmer = sampleProducts.map(product => ({
            ...product,
            farmer: farmer._id
        }));

        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new products
        await Product.insertMany(productsWithFarmer);
        
        console.log('Products seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts(); 