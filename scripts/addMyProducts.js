const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

// Example of how to add your own products
const myProducts = [
    {
        name: "Fresh Organic Tomatoes",
        description: "Fresh, locally grown organic tomatoes. Perfect for salads and cooking.",
        price: 40,
        quantity: 100,
        unit: "kg",
        category: "Vegetables",
        image: "/images/tomatoes.jpg",
        status: "available"
    },
    {
        name: "Fresh Cow Milk",
        description: "Pure, unprocessed milk from grass-fed cows. Daily fresh supply.",
        price: 60,
        quantity: 50,
        unit: "kg",
        category: "Dairy",
        image: "/images/milk.jpg",
        status: "available"
    },
    {
        name: "Premium Basmati Rice",
        description: "High-quality basmati rice, perfect for biryani and pulao.",
        price: 120,
        quantity: 500,
        unit: "kg",
        category: "Grains",
        image: "/images/rice.jpg",
        status: "available"
    },
    {
        name: "Farm Fresh Eggs",
        description: "Fresh eggs from free-range chickens. Daily collection.",
        price: 8,
        quantity: 200,
        unit: "kg",
        category: "Poultry",
        image: "/images/eggs.jpg",
        status: "available"
    },
    {
        name: "Organic Potatoes",
        description: "Fresh organic potatoes, great for various dishes.",
        price: 30,
        quantity: 200,
        unit: "kg",
        category: "Vegetables",
        image: "/images/potatoes.jpg",
        status: "available"
    },
    {
        name: "Red Lentils (Masoor Dal)",
        description: "High-protein red lentils, great for soups and curries.",
        price: 140,
        quantity: 300,
        unit: "kg",
        category: "Pulses",
        image: "/images/lentils.jpg",
        status: "available"
    },
    {
        name: "Fresh Green Peas",
        description: "Sweet and fresh green peas, perfect for curries and pulao.",
        price: 80,
        quantity: 100,
        unit: "kg",
        category: "Vegetables",
        image: "/images/peas.jpg",
        status: "available"
    },
    {
        name: "Organic Wheat Flour",
        description: "Freshly ground organic wheat flour, perfect for rotis and breads.",
        price: 45,
        quantity: 200,
        unit: "kg",
        category: "Grains",
        image: "/images/wheat.jpg",
        status: "available"
    }
];

async function addMyProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-connect', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Get your farmer account
        const farmer = await User.findOne({ role: 'farmer' });
        if (!farmer) {
            console.log('No farmer account found. Please register as a farmer first.');
            process.exit(1);
        }

        // Add your products
        const productsWithFarmer = myProducts.map(product => ({
            ...product,
            farmer: farmer._id
        }));

        // Insert your products
        await Product.insertMany(productsWithFarmer);
        
        console.log('Your products added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error adding products:', error);
        process.exit(1);
    }
}

addMyProducts(); 