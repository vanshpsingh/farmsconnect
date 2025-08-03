const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { productId, address, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        // For demo: allow any order, do not check or reduce quantity
        const order = new Order({
            user: req.user.id,
            product: product._id,
            quantity,
            address
        });
        await order.save();
        res.json({ msg: 'Order placed successfully', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user orders
router.get('/', auth, async (req, res) => {
    try {
        console.log('--- Fetching orders for user ID:', req.user.id);
        const orders = await Order.find({ user: req.user.id })
            .populate('product')
            .sort({ createdAt: -1 });
        
        console.log('--- Found orders from DB:', orders);
        res.json(orders);
    } catch (err) {
        console.error('--- Error fetching orders:', err.message);
        res.status(500).send('Server Error');
    }
});

// Get orders for products sold by the current user (farmer)
router.get('/sold', auth, async (req, res) => {
    try {
        // Find all orders where the product's farmer matches the current user
        const orders = await Order.find()
            .populate({
                path: 'product',
                match: { farmer: req.user.id },
                populate: { path: 'farmer', select: 'name email' }
            })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        // Filter out orders where product is null (not sold by this user)
        const soldOrders = orders.filter(order => order.product);
        res.json(soldOrders);
    } catch (err) {
        console.error('--- Error fetching sold orders:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 