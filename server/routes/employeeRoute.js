// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Employee login route
// routes/employeeRoutes.js
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find employee by email instead of employeeId
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: employee._id,
                email: employee.email,
                role: 'employee'
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            employee: {
                id: employee._id,
                email: employee.email,
                firstName: employee.firstName,
                lastName: employee.lastName
            }
        });

    } catch (error) {
        console.error('Employee login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example - Get employee profile
router.get('/profile', authenticateEmployee, async (req, res) => {
    try {
        const employee = await Employee.findById(req.employee.id).select('-password');
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to authenticate employee
function authenticateEmployee(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = router;