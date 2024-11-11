const mongoose = require('mongoose');

const PayoffSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true
    },
    recipientBank: {
        type: String,
        required: true
    },
    recipientAccount: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    swiftCode: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payoff', PayoffSchema);
