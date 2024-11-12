import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentVerification = () => {
    const [transaction, setTransaction] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState({});
    const [error, setError] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            // Using the correct endpoint as defined in routes
            const response = await axios.get(`http://localhost:5000/api/transactions/${id}`);
            setTransaction(response.data);
            const initialStatus = {
                recipientName: false,
                recipientBank: false,
                recipientAccountNumber: true, 
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
        // Check if all fields are verified
        const allFieldsVerified = Object.values(verificationStatus).every(status => status);
    
        if (!allFieldsVerified) {
            setError("Please verify all fields before submitting to SWIFT");
            return;
        }
    
        setIsSubmitting(true);
        setError("");
    
        // Retrieve the token from local storage, state, or context
        const token = localStorage.getItem('token'); // Adjust this line based on where you store the token
    
        try {
            const acceptResponse = await axios.put(`http://localhost:5000/api/payments/${transactionId}`, {
                status: 'Completed'
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
    
            if (acceptResponse.data) {
                console.log("Accept response:", acceptResponse.data);
                navigate("/employee-dashboard", { 
                    state: { message: "Payment successfully submitted to SWIFT and accepted" }
                });
            } else {
                throw new Error('No response data received');
            }
        } catch (err) {
            console.error("Submit to SWIFT Error:", err);
    
            if (err.response) {
                setError(`Server Error: ${err.response.data.message || 'Failed to submit payment to SWIFT'}`);
            } else if (err.request) {
                setError("No response received from server. Please check your connection.");
            } else {
                setError("Failed to submit payment to SWIFT. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const rejectTransaction = async () => {
        if (!rejectionReason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }

        try {
            // Using the transactions endpoint as defined in routes
            const rejectResponse = await axios.put(`http://localhost:5000/api/transactions/${transactionId}`, {
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
                        disabled={isSubmitting}
                        className={`flex-1 py-2 px-4 rounded ${
                            isSubmitting 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit to SWIFT'}
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
                            disabled={isSubmitting}
                            className={`px-4 py-2 ${
                                isSubmitting 
                                    ? 'bg-red-300 cursor-not-allowed' 
                                    : 'bg-red-500 hover:bg-red-600'
                            } text-white rounded transition-colors`}
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