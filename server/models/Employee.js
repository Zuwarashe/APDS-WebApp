const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema({
    employeeId: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^EMP\d{6}$/ // Format: EMP followed by 6 digits
    },
    firstName: { 
        type: String, 
        required: true,
        match: /^[a-zA-Z\s]{1,50}$/
    },
    lastName: { 
        type: String, 
        required: true,
        match: /^[a-zA-Z\s]{1,50}$/
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: 'employee'
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
});



EmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Export the model
module.exports = mongoose.model('Employee', EmployeeSchema);