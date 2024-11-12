// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const authenticateEmployee = require('../middleware/authenticateEmployee');


// Get all transactions
router.get('/transactions', authenticateEmployee, async (req, res) => {
    try {
        const transactions = await Payment.find()
            .sort({ paymentDate: -1 }); // Sort by most recent first
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error while fetching transactions' });
    }
});

// Get specific transaction by ID
router.get('/transactions/:id', authenticateEmployee, async (req, res) => {
    try {
        const transaction = await Payment.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ message: 'Server error while fetching transaction' });
    }
});

// Update payment status
router.put('/payments/:id', authenticateEmployee, async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        
        // Validate status
        if (!['Pending', 'Completed', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // If status is Rejected, rejectionReason is required
        if (status === 'Rejected' && !rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const updateData = {
            status,
            ...(rejectionReason && { rejectionReason }),
            lastUpdated: new Date()
        };

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return updated document
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Server error while updating payment' });
    }
});

module.exports = router;