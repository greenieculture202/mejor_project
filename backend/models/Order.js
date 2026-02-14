const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    name: { type: String }, // snapshot
    image: { type: String }, // snapshot
    price: { type: Number },
    quantity: { type: Number, default: 1 }
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        zip: String
    },
    paymentMethod: { type: String, default: 'COD' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
