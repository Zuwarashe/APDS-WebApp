//import React, { useState } from 'react';
import React, { useEffect, useState } from "react";
import axios from 'axios';

import { Link } from 'react-router-dom';
import './App.css'; // Assuming you have CSS for the Dashboard

function Dashboard() {
    // State management
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    useEffect(() => {
        // Retrieve user info from local storage
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');

        if (storedFirstName && storedLastName) {
            setFirstName(storedFirstName);
            setLastName(storedLastName);
        }
    }, []);

    
    const [accountDetails] = useState({ 
        accountNumber: '1234567890', 
        availableBalance: 2500.50 
    });
    const [transactions] = useState([ // Fake transaction data for testing
        {
            id: '1',
            date: '2024-10-01',
            description: 'Payment to XYZ Store',
            amount: 150.75
        },
        {
            id: '2',
            date: '2024-09-25',
            description: 'Online Transfer',
            amount: 500.00
        },
        {
            id: '3',
            date: '2024-09-20',
            description: 'Payment to ABC Corp',
            amount: 300.00
        }
    ]);

    const maskAccountNumber = (accountNumber) => {
        return accountNumber.replace(/\d(?=\d{4})/g, 'X'); // Mask all but last 4 digits
    };

    const handlePayAgain = (transactionId) => {
        alert(`Re-initiating payment for transaction ID: ${transactionId}`);
    };

    return (
        <div className="dashboard">
            <div className="side-nav">
                <h3>Menu</h3>
                <ul>
                    <li><Link to="/transactions">Transactions</Link></li>
                    <li><Link to="/payments">Payments</Link></li>
                </ul>
            </div>

            <div className="content">
                <h1>Customer Dashboard</h1>
                <p>Hello, {firstName} {lastName}!</p>

                <div className="banking-details">
                    <h2>Banking Details</h2>
                    <p>Account No: {maskAccountNumber(accountDetails.accountNumber)}</p>
                    <p>Available Balance: ${accountDetails.availableBalance.toFixed(2)}</p>
                </div>

                <div className="transactions">
                    <h2>Payment Receipts</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.amount.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handlePayAgain(transaction.id)}>
                                            Pay Again
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;