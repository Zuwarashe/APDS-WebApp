const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    idNumber: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' }, 
    isActive: { type: Boolean, default: true }
});


module.exports = mongoose.model('User', UserSchema, 'customerUser');
