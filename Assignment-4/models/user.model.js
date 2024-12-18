const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: [String]
});

let userModel = mongoose.model("user", userSchema);

module.exports = userModel;