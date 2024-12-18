const mongoose = require("mongoose");

let Pschema = mongoose.Schema({
    title: String,
    description: String,
    price : Number,
});


let productModel = mongoose.model("Products", Pschema);


module.exports = productModel;