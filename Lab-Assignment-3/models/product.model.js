const mongoose = require("mongoose");

let productSchema = mongoose.Schema
({
    title:String,
    description: String,
    price: Number,
});

let productModel = mongoose.model("products", productSchema);

module.exports = productModel;