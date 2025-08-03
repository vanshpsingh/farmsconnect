const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Get all products (with optional pagination and filtering)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, search } = req.query;
        const query = {};
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        const products = await Product.find(query)
            .populate('farmer', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(query);
        res.json({ products, total });
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new product (with image upload)
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (req.user.role !== 'farmer') {
        return res.status(403).json({ msg: 'Authorization denied. Only farmers can add products.' });
    }
    try {
        const { name, description, price, quantity, unit, category, displayFarmerName } = req.body;
        let imagePath = req.body.image;
        if (req.file) {
            imagePath = '/images/' + req.file.filename;
        }
        if (!name || !description || !price || !quantity || !unit || !category) {
            return res.status(400).json({ msg: 'Please fill in all required fields' });
        }
        if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            return res.status(400).json({ msg: 'Price and quantity must be positive numbers' });
        }
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            unit,
            category,
            displayFarmerName,
            image: imagePath,
            farmer: req.user.id
        });
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message, details: err.errors });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update product (with image upload, only owner)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const updates = (({ name, description, price, quantity, unit, category, displayFarmerName }) => ({ name, description, price, quantity, unit, category, displayFarmerName }))(req.body);
        if (req.file) {
            updates.image = '/images/' + req.file.filename;
        }
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) product[key] = updates[key];
        });
        await product.save();
        res.json(product);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message, details: err.errors });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete product (only owner)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// List all products for the logged-in user (farmer)
router.get('/my', auth, async (req, res) => {
    try {
        console.log('[GET /api/products/my] req.user:', req.user);
        if (!req.user || !req.user.id) {
            console.error('[GET /api/products/my] Missing req.user or req.user.id');
            return res.status(401).json({ msg: 'Unauthorized: user info missing from token' });
        }
        const query = { farmer: req.user.id };
        console.log('[GET /api/products/my] Query:', query);
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('[GET /api/products/my] Error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router; 