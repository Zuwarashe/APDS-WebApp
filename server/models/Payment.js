const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    recipientName: { 
        type: String, 
        required: true, 
        match: /^[a-zA-Z\s]{1,100}$/ // Only alphabets and spaces, up to 100 characters
    },
    recipientBank: { 
        type: String, 
        required: true, 
        match: /^[a-zA-Z\s]{1,100}$/ // Only alphabets and spaces, up to 100 characters
    },
    recipientAccountNumber: { 
        type: String, 
        required: true, 
        match: /^\d{10}$/ // Ensures a valid 10-digit account number
    },
    amount: { 
        type: Number, 
        required: true, 
        min: [1, 'Amount must be at least 1'] // The minimum amount allowed for transfer is 1
    },
    swiftCode: { 
        type: String, 
        required: true, 
        match: /^[A-Z0-9]{8,11}$/ // Ensures valid SWIFT code format
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Link the payment to the user making it
    paymentDate: { 
        type: Date, 
        default: Date.now 
    }, // Automatically set the current date for the payment
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Pending' 
    } // Keep track of the payment status
});

// Define the model
const Payment = mongoose.model('Payment', PaymentSchema);

// Export the Payment model
module.exports = Payment;
