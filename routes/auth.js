const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, address, phone, age } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role,
            address,
            phone,
            age
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
                age: user.age,
                phone: user.phone
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log('Login successful for user:', user.id);

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
                age: user.age,
                phone: user.phone
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('Token generation error:', err);
                    throw err;
                }
                console.log('Token generated successfully');
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Server error');
    }
});

// Get logged-in user's profile
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('Profile request for user:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Profile error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 