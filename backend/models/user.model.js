const mongoose = require('mongoose');

// make sure email or user id not twice
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

// use validator its import from top of file
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);