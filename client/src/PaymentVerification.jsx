import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentVerification = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all pending transactions initially
  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/transactions/pending");
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransaction = async (transactionId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`);
      const data = await response.json();
      setSelectedTransaction(data);
    } catch (err) {
      setError("Error fetching transaction details");
    } finally {
      setLoading(false);
    }
  };

  const verifyField = async (transactionId, field) => {
    try {
      await fetch("http://localhost:5000/api/transactions/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          field,
          isVerified: true,
        }),
      });
      await fetchTransaction(transactionId);
    } catch (err) {
      setError("Error verifying field");
    }
  };

  const submitToSwift = async (transactionId) => {
    try {
      await fetch("http://localhost:5000/api/transactions/submit-to-swift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId }),
      });
      alert("Transaction submitted to SWIFT");
      // Refresh the transactions list after submission
      fetchPendingTransactions();
      setSelectedTransaction(null);
    } catch (err) {
      setError("Error submitting transaction to SWIFT");
    }
  };

  const rejectTransaction = async (transactionId) => {
    if (!rejectionReason) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/transactions/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          reason: rejectionReason,
        }),
      });
      setTransactions(prev => prev.filter(trans => trans._id !== transactionId));
      setSelectedTransaction(null);
      setRejectionReason("");
      alert("Transaction rejected successfully");
    } catch (err) {
      setError("Error rejecting transaction");
    }
  };

  const renderVerificationField = (label, value, field) => (
    <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
      <Button
        onClick={() => verifyField(selectedTransaction._id, field)}
        variant={selectedTransaction.verifications[field] ? "outline" : "default"}
        className="ml-4"
      >
        {selectedTransaction.verifications[field] ? "Verified ✓" : "Verify"}
      </Button>
    </div>
  );

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Bank Employee Verification</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {selectedTransaction ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Transaction Details</h3>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderVerificationField("Recipient Name", selectedTransaction.recipientName, "recipientName")}
            {renderVerificationField("Recipient Bank", selectedTransaction.recipientBank, "recipientBank")}
            {renderVerificationField("Account Number", selectedTransaction.recipientAccountNumber, "recipientAccountNumber")}
            {renderVerificationField("Amount", selectedTransaction.amount, "amount")}
            {renderVerificationField("SWIFT Code", selectedTransaction.swiftCode, "swiftCode")}

            <div className="mt-6 space-y-4">
              <Button
                onClick={() => submitToSwift(selectedTransaction._id)}
                disabled={!Object.values(selectedTransaction.verifications).every(v => v)}
                className="w-full"
              >
                Submit to SWIFT
              </Button>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <Button
                  variant="destructive"
                  onClick={() => rejectTransaction(selectedTransaction._id)}
                  className="w-full"
                >
                  Reject Transaction
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {transactions.map(transaction => (
            <Card key={transaction._id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Recipient: {transaction.recipientName}</p>
                    <p className="text-sm text-gray-500">Amount: {transaction.amount}</p>
                  </div>
                  <Button onClick={() => fetchTransaction(transaction._id)}>
                    View & Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;