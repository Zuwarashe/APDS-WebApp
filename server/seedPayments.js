const mongoose = require('mongoose');
require('dotenv').config();  // Make sure to use dotenv to load environment variables

// Define MongoDB URI and Payment Schema
const dbURI = process.env.MONGO_URI;  // Use the URI from your .env file
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection error:', error));

const paymentSchema = new mongoose.Schema({
  customerId: String,
  recipientName: String,
  recipientBank: String,
  recipientAccount: String,
  amount: Number,
  swiftCode: String,
  status: { type: String, default: 'Pending' },
  verifications: {
    recipientName: { type: Boolean, default: false },
    recipientBank: { type: Boolean, default: false },
    recipientAccountNumber: { type: Boolean, default: false },
    amount: { type: Boolean, default: false },
    swiftCode: { type: Boolean, default: false }
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Define sample payments linked to Nino Maripane's customerId
const payments = [
  {
    customerId: '6732062c1e80bcd7c18b354f', // Nino Maripane's customer ID
    recipientName: 'John Doe',
    recipientBank: 'ABC Bank',
    recipientAccount: '987654321',
    amount: 1500.0,
    swiftCode: 'ABC123456',
    status: 'Pending'
  },
  {
    customerId: '6732062c1e80bcd7c18b354f',
    recipientName: 'Jane Smith',
    recipientBank: 'XYZ Bank',
    recipientAccount: '123456789',
    amount: 2000.0,
    swiftCode: 'XYZ987654',
    status: 'Pending'
  },
  // Additional payment transactions
  {
    customerId: '6732062c1e80bcd7c18b354f',
    recipientName: 'Alice Brown',
    recipientBank: 'DEF Bank',
    recipientAccount: '112233445',
    amount: 500.0,
    swiftCode: 'DEF987654',
    status: 'Pending'
  },
  {
    customerId: '6732062c1e80bcd7c18b354f',
    recipientName: 'Bob Johnson',
    recipientBank: 'GHI Bank',
    recipientAccount: '223344556',
    amount: 1200.0,
    swiftCode: 'GHI654321',
    status: 'Pending'
  },
  {
    customerId: '6732062c1e80bcd7c18b354f',
    recipientName: 'Charlie Williams',
    recipientBank: 'JKL Bank',
    recipientAccount: '334455667',
    amount: 750.0,
    swiftCode: 'JKL123456',
    status: 'Pending'
  },
  {
    customerId: '6732062c1e80bcd7c18b354f',
    recipientName: 'David Taylor',
    recipientBank: 'MNO Bank',
    recipientAccount: '445566778',
    amount: 3000.0,
    swiftCode: 'MNO987654',
    status: 'Pending'
  }
];

// Insert the payments into MongoDB
const seedDatabase = async () => {
  try {
    await Payment.insertMany(payments);
    console.log('Payments seeded successfully');
  } catch (error) {
    console.error('Error seeding payments:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
