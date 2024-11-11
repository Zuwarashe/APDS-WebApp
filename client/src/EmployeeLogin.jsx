import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import React from 'react';

function EmployeeLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // RegEx Input Whitelisting
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error message

        if (!usernameRegex.test(username)) {
            setError("Username must be alphanumeric and between 3-30 characters");
            return;
        }
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long, with at least one letter and one number");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5000/api/login', { username, password });
            if (result.data.success) {
                alert("Login successful!");
                localStorage.setItem('username', username);
                navigate('/employee-dashboard');
            } else {
                setError("Invalid username or password");
            }
        } catch (error) {
            console.error(error);
            setError("Error logging in. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Employee Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            autoComplete="off"
                            name="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError(""); // Clear error when input changes
                            }}
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(""); // Clear error when input changes
                            }}
                            className="form-control rounded-0"
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <p>Don't have an account?</p>
                <Link to="/employee-signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default EmployeeLogin;