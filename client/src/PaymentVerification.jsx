import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentVerification = () => {
    const [transaction, setTransaction] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState({});
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    
    const location = useLocation();
    const navigate = useNavigate();
    const { transactionId } = location.state || {};

    useEffect(() => {
        if (transactionId) {
            fetchTransaction(transactionId);
        }
    }, [transactionId]);

    const fetchTransaction = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/${id}`);
            setTransaction(response.data);
            const initialStatus = {
                recipientName: false,
                recipientBank: false,
                recipientAccountNumber: true, // Hardcode recipientAccountNumber as verified
                amount: false,
                swiftCode: false
            };
            setVerificationStatus(initialStatus);
        } catch (err) {
            setError("Error fetching transaction details");
            console.error("Fetch Transaction Error:", err);
        }
    };

    const verifyField = (field) => {
        setVerificationStatus(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const submitToSwift = async () => {
        try {
            // Check that all fields except 'recipientAccountNumber' are verified
            const fieldsToVerify = Object.entries(verificationStatus)
                .filter(([field]) => field !== 'recipientAccountNumber')
                .map(([_, verified]) => verified);
    
            if (!fieldsToVerify.every(Boolean)) {
                const unverifiedFields = Object.entries(verificationStatus)
                    .filter(([field, verified]) => !verified && field !== 'recipientAccountNumber')
                    .map(([field]) => field);
                setError(`Please verify the following fields: ${unverifiedFields.join(', ')}`);
                return;
            }
    
            // Retrieve the token from local storage or your token storage location
            const token = localStorage.getItem('token');
    
            // Update payment status and submit to SWIFT in one PUT request
            try {
                const response = await axios.put(
                    `http://localhost:5000/api/payments/${transactionId}/submit-to-swift`, // One endpoint for both actions
                    {}, // No body needed, all handled in backend
                    {
                        headers: {
                            'x-auth-token': token, // Add token in headers
                        },
                    }
                );
    
                if (response.status === 200) {
                    // Navigate to the employee dashboard with a success message
                    navigate("/employee-dashboard", {
                        state: { message: "Transaction successfully submitted to SWIFT" },
                    });
                }
            } catch (error) {
                console.error('Submit to SWIFT Error:', error);
                setError("Failed to submit transaction to SWIFT");
            }
        } catch (err) {
            console.error('Submit to SWIFT Error:', err);
            setError('Failed to submit transaction to SWIFT');
        }
    };
    
    const rejectTransaction = async () => {
        if (!rejectionReason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }

        try {
            const rejectResponse = await axios.put(`http://localhost:5000/api/payments/${transactionId}`, {
                status: 'Rejected',
                rejectionReason: rejectionReason
            });
            console.log("Reject response:", rejectResponse.data);

            navigate("/employee-dashboard", { 
                state: { message: "Transaction rejected successfully" }
            });
        } catch (err) {
            setError("Failed to reject transaction");
            console.error("Reject Transaction Error:", err);
        }
    };

    if (!transaction) {
        return <div>Loading...</div>;
    }

    const isAllVerified = Object.values(verificationStatus).every(Boolean);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payment Verification</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
                    {Object.entries(transaction).map(([field, value]) => {
                        if (['recipientName', 'recipientBank', 'recipientAccountNumber', 'amount', 'swiftCode'].includes(field)) {
                            return (
                                <div key={field} className="mb-4 p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-gray-700">
                                            {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                        </h3>
                                        <p className="text-lg">
                                            {field === 'amount' 
                                                ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                                                : value}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => verifyField(field)}
                                        disabled={verificationStatus[field]}
                                        className={`px-4 py-2 rounded transition-colors ${
                                            verificationStatus[field]
                                                ? 'bg-green-500 text-white cursor-default'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                    >
                                        {verificationStatus[field] ? 'Verified ✓' : 'Verify'}
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                <div className="flex gap-4 mt-6 pt-6 border-t">
                <button
    onClick={submitToSwift}
    // Temporarily remove the `disabled` attribute to test if the button is disabled
    className="flex-1 py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
>
    {isSubmitting ? 'Processing...' : 'Submit to SWIFT'}
</button>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded"
                        />
                        <button
                            onClick={rejectTransaction}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentVerification;
