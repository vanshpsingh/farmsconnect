const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-connect', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if test user already exists
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (testUser) {
            console.log('Test user already exists');
            process.exit(0);
        }

        // Create test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);

        testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'farmer',
            address: '123 Test Street',
            phone: '1234567890'
        });

        await testUser.save();
        console.log('Test user created successfully');
        console.log('Email: test@example.com');
        console.log('Password: test123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}

createTestUser(); 