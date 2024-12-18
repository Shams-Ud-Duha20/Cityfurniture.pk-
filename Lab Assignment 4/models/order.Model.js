const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        name: String,
        street: String,
        city: String,
        postalCode: String
    },
    items: [
        {
            title: String,
            description: String,
            price: Number
        }
    ],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});







module.exports = mongoose.model("Order", orderSchema);