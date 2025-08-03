const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'l', 'ml', 'piece']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    displayFarmerName: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'other']
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 