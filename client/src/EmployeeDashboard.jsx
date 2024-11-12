import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeeDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigate = useNavigate();

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments'); // API call to fetch payments
        setTransactions(response.data); // Set the state with fetched transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []); // Empty array ensures this runs only once on mount

  // Handle the click on a transaction
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleVerifyTransaction = (transactionId) => {
    if (!transactionId) {
      console.error("No transaction ID provided");
      return;
    }

    navigate('/payment-verification', {
      state: { transactionId: transactionId.toString() }
    });
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <p>Welcome to the employee dashboard. Here you can manage customer transactions.</p>

      <div className="transactions">
        <h2>All Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient Name</th>
              <th>Recipient Bank</th>
              <th>Recipient Account</th>
              <th>Amount</th>
              <th>SWIFT Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{transactions.map((transaction) => (
            <tr key={transaction._id} onClick={() => handleTransactionClick(transaction)} className={selectedTransaction?._id === transaction._id ? 'selected' : ''}>
              <td>{transaction._id}</td>
              <td>{transaction.recipientName}</td>
              <td>{transaction.recipientBank}</td>
              <td>{transaction.recipientAccount}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.swiftCode}</td>
              <td>{transaction.status}</td>
              <td>{transaction.status === 'Pending' && (
                <button onClick={(e) => {e.stopPropagation(); handleVerifyTransaction(transaction._id);}}>Verify</button>
              )}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
export default EmployeeDashboard;