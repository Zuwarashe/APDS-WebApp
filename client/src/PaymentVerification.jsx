import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function PaymentVerification() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const location = useLocation();
    const { transactionId } = location.state || {}; // Get transaction ID passed from EmployeeDashboard

    // Fetch all pending transactions initially
    useEffect(() => {
        if (transactionId) {
            fetchTransaction(transactionId); // Fetch the selected transaction details
        } else {
            // If no specific transaction, fetch all transactions
            axios.get("http://localhost:5000/api/transactions") // Corrected URL for fetching transactions
                .then(response => setTransactions(response.data))
                .catch(error => {
                    console.error("Error fetching transactions:", error);
                    setError(error.response?.data?.message || "Error fetching transactions");
                });
        }
    }, [transactionId]);

    const fetchTransaction = (transactionId) => {
        if (!transactionId) {
            setError("Invalid transaction ID.");
            return;
        }

        axios.get(`http://localhost:5000/api/transactions/${transactionId}`)
            .then(response => {
                if (response.data) {
                    setSelectedTransaction(response.data);
                    setError(""); // Clear any existing errors
                } else {
                    setError("Transaction not found");
                }
            })
            .catch(error => {
                console.error("Error fetching transaction details:", error);
                setError(error.response?.data?.message || "Error fetching transaction details");
            });
    };

    const verifyField = (transactionId, field) => {
        axios.post("http://localhost:5000/api/transactions/verify", {
            transactionId,
            field,
            isVerified: true
        })
            .then(() => {
                // After verification, refetch the updated transaction details
                fetchTransaction(transactionId);
            })
            .catch(error => setError("Error verifying field"));
    };

    const submitToSwift = (transactionId) => {
        axios.post("http://localhost:5000/api/transactions/submit-to-swift", { transactionId })
            .then(() => alert("Transaction submitted to SWIFT"))
            .catch(error => setError("Error submitting transaction to SWIFT"));
    };

    const rejectTransaction = (transactionId) => {
        axios.post("http://localhost:5000/api/transactions/reject", {
            transactionId,
            reason: rejectionReason
        })
            .then(() => {
                setTransactions(prev => prev.filter(trans => trans._id !== transactionId));
                alert("Transaction rejected");
            })
            .catch(error => setError("Error rejecting transaction"));
    };

    return (
        <div>
            <h2>Bank Employee Verification</h2>
            {error && <p className="text-danger">{error}</p>}
            
            {selectedTransaction ? (
                <div key={selectedTransaction._id} className="transaction-card">
                    <p><strong>Recipient Name:</strong> {selectedTransaction.recipientName}</p>
                    <button onClick={() => verifyField(selectedTransaction._id, "recipientName")}>Verify</button>

                    <p><strong>Recipient Bank:</strong> {selectedTransaction.recipientBank}</p>
                    <button onClick={() => verifyField(selectedTransaction._id, "recipientBank")}>Verify</button>

                    <p><strong>Account Number:</strong> {selectedTransaction.recipientAccountNumber}</p>
                    <button onClick={() => verifyField(selectedTransaction._id, "recipientAccountNumber")}>Verify</button>

                    <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
                    <button onClick={() => verifyField(selectedTransaction._id, "amount")}>Verify</button>

                    <p><strong>SWIFT Code:</strong> {selectedTransaction.swiftCode}</p>
                    <button onClick={() => verifyField(selectedTransaction._id, "swiftCode")}>Verify</button>

                    <button
                        onClick={() => submitToSwift(selectedTransaction._id)}
                        disabled={!Object.values(selectedTransaction.verifications).every(v => v)}
                        className="btn btn-primary mt-2">
                        Submit
                    </button>

                    <div className="rejection-section">
                        <input
                            type="text"
                            placeholder="Rejection reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <button
                            onClick={() => rejectTransaction(selectedTransaction._id)}
                            className="btn btn-danger mt-2">
                            Reject
                        </button>
                    </div>
                </div>
            ) : (
                transactions.map(transaction => (
                    <div key={transaction._id} className="transaction-card">
                        <p><strong>Recipient Name:</strong> {transaction.recipientName}</p>
                        <button onClick={() => fetchTransaction(transaction._id)}>
                            View & Verify
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default PaymentVerification;
