const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    image: {
        type: String,
        default: null
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
