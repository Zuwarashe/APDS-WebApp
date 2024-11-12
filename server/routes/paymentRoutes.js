// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const authenticateEmployee = require('../middleware/authenticateEmployee');

app.use('/api/payments', paymentRoutes);


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

// Submit to SWIFT
router.post('/transactions/submit-to-swift', authenticateEmployee, async (req, res) => {
    try {
        const { transactionId } = req.body;

        // First, verify the transaction exists and is in a valid state
        const transaction = await Payment.findById(transactionId);
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'Pending') {
            return res.status(400).json({ 
                message: 'Transaction cannot be submitted to SWIFT - invalid status' 
            });
        }

        // Here you would typically integrate with the SWIFT system
        // This is a placeholder for the SWIFT submission logic
        try {
            // Mock SWIFT submission
            const swiftSubmissionResult = await submitToSwiftSystem(transaction);
            
            // Update transaction status to completed
            transaction.status = 'Completed';
            transaction.swiftReference = swiftSubmissionResult.referenceNumber;
            transaction.completedAt = new Date();
            await transaction.save();

            res.json({ 
                message: 'Transaction successfully submitted to SWIFT',
                swiftReference: swiftSubmissionResult.referenceNumber
            });
        } catch (swiftError) {
            console.error('SWIFT submission error:', swiftError);
            return res.status(500).json({ 
                message: 'Error submitting to SWIFT system',
                error: swiftError.message
            });
        }

    } catch (error) {
        console.error('Error in SWIFT submission endpoint:', error);
        res.status(500).json({ message: 'Server error while processing SWIFT submission' });
    }
});

// Mock function for SWIFT system integration
async function submitToSwiftSystem(transaction) {
    // This is a mock function - replace with actual SWIFT integration
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                referenceNumber: 'SWIFT-' + Date.now() + '-' + Math.random().toString(36).substring(7)
            });
        }, 1000); // Simulate network delay
    });
}

// Verify specific field of a transaction
router.post('/transactions/verify', authenticateEmployee, async (req, res) => {
    try {
        const { transactionId, field } = req.body;
        
        // Validate field is one of the allowed fields
        const allowedFields = ['recipientName', 'recipientBank', 'recipientAccountNumber', 'amount', 'swiftCode'];
        if (!allowedFields.includes(field)) {
            return res.status(400).json({ message: 'Invalid field for verification' });
        }

        const transaction = await Payment.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Create or update verification field
        if (!transaction.verifications) {
            transaction.verifications = {};
        }
        transaction.verifications[field] = {
            verified: true,
            verifiedBy: req.employee.id,
            verifiedAt: new Date()
        };

        await transaction.save();
        res.json({ message: `${field} verified successfully` });

    } catch (error) {
        console.error('Error in field verification:', error);
        res.status(500).json({ message: 'Server error during field verification' });
    }
});

// Get verification status for a transaction
router.get('/transactions/:id/verification-status', authenticateEmployee, async (req, res) => {
    try {
        const transaction = await Payment.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction.verifications || {});
    } catch (error) {
        console.error('Error fetching verification status:', error);
        res.status(500).json({ message: 'Server error while fetching verification status' });
    }
});

module.exports = router;