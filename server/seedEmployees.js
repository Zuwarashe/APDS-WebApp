// seedEmployees.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Employee = require('./models/Employee'); // Make sure path matches your project structure

dotenv.config();

const employees = [
    {
        employeeId: 'EMP000001',
        firstName: 'Nande',
        lastName: 'Mzantsi',
        email: 'Mzantsi@bank.com',
        password: 'password123'
    },
    {
        employeeId: 'EMP000002',
        firstName: 'Manneng',
        lastName: 'Maripane',
        email: 'Maripane@bank.com',
        password: 'password123'
    },
    {
        employeeId: 'EMP000003',
        firstName: 'Courtney',
        lastName: 'Wicomb',
        email: 'Wicomb@bank.com',
        password: 'password123'
    },
    {
        employeeId: 'EMP000004',
        firstName: 'Zuwa',
        lastName: 'Makarimayi',
        email: 'Makarimayi@bank.com',
        password: 'password123'
    }
];

const seedEmployees = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Clear existing employees
        await Employee.deleteMany({});
        console.log('Cleared existing employees');

        // Hash passwords and create employees
        const employeePromises = employees.map(async (employee) => {
            const hashedPassword = await bcrypt.hash(employee.password, 10);
            return new Employee({
                ...employee,
                password: hashedPassword
            });
        });

        const hashedEmployees = await Promise.all(employeePromises);
        await Employee.insertMany(hashedEmployees);
        
        console.log('Successfully seeded employees');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding employees:', error);
        process.exit(1);
    }
};

seedEmployees();