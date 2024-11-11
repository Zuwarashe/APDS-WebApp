import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [identifier, setIdentifier] = useState(""); // Username, account number, or email
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [userType, setUserType] = useState("customer"); // Add user type selector

    const navigate = useNavigate();

    // RegEx Input Whitelisting
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/; // Username: alphanumeric, 3-30 chars
    const accountNumberRegex = /^\d{10}$/; // Account number: 10 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Validation based on user type
        if (userType === "customer") {
            const isUsernameValid = usernameRegex.test(identifier);
            const isAccountNumberValid = accountNumberRegex.test(identifier);

            if (!isUsernameValid && !isAccountNumberValid) {
                setError("Please enter a valid username or account number");
                return;
            }
        } else {
            // Employee validation
            if (!emailRegex.test(identifier)) {
                setError("Please enter a valid email address");
                return;
            }
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and contain at least one letter and one number");
            return;
        }

        try {
            let response;
            
            if (userType === "customer") {
                // Customer login
                response = await axios.post('http://localhost:5000/api/login', {
                    identifier,
                    password
                });
                
                if (response.data.token && response.data.userId) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId); // Store userId here
                    localStorage.setItem('userType', 'customer');
                    navigate('/dashboard');
                }
                
            } else {
                // Employee login
                response = await axios.post('http://localhost:5000/api/employees/login', {
                    email: identifier,
                    password
                });
                
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userType', 'employee');
                    localStorage.setItem('employeeData', JSON.stringify(response.data.employee));
                    navigate('/employee-dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* User Type Selection */}
                    <div className="mb-3">
                        <label className="me-3"><strong>Login As:</strong></label>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="userType"
                                value="customer"
                                checked={userType === "customer"}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            <label className="form-check-label">Customer</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="userType"
                                value="employee"
                                checked={userType === "employee"}
                                onChange={(e) => setUserType(e.target.value)}
                            />
                            <label className="form-check-label">Employee</label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="identifier">
                            <strong>
                                {userType === "customer" 
                                    ? "Username or Account Number" 
                                    : "Email Address"}
                            </strong>
                        </label>
                        <input
                            type={userType === "employee" ? "email" : "text"}
                            placeholder={userType === "customer" 
                                ? "Enter Username or Account Number" 
                                : "Enter Email Address"}
                            autoComplete="off"
                            name="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                {userType === "customer" && (
                    <>
                        <p>Don't Have an Account?</p>
                        <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;