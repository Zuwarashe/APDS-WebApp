const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    recipientName: { 
        type: String, 
        required: true, 
        match: /^[a-zA-Z\s]{1,100}$/
    },
    recipientBank: { 
        type: String, 
        required: true, 
        match: /^[a-zA-Z\s]{1,100}$/
    },
    recipientAccountNumber: { 
        type: String, 
        required: true, 
        match: /^\d{10}$/
    },
    amount: { 
        type: Number, 
        required: true, 
        min: [1, 'Amount must be at least 1']
    },
    swiftCode: { 
        type: String, 
        required: true, 
        match: /^[A-Z0-9]{8,11}$/
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending' 
    },
    verifications: {
        recipientName: { type: Boolean, default: false },
        recipientBank: { type: Boolean, default: false },
        recipientAccountNumber: { type: Boolean, default: false },
        amount: { type: Boolean, default: false },
        swiftCode: { type: Boolean, default: false }
    },
    rejectionReason: { type: String, default: '' }
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
