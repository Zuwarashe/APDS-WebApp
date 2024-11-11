import { useState } from "react";
//import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

import axios from 'axios';

function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); 
    

//-----------RegEx Input Whitelisting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    const idNumberRegex = /^\d{13}$/; // Assuming an ID number is 13 digits
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log({ firstName, lastName, email, username, idNumber, accountNumber, password });

//-------------Adding input validation
        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }      
        if (!usernameRegex.test(username)) {
            setError("Username must be alphanumeric and between 3-30 characters");
            return;
        }   
        if (!idNumberRegex.test(idNumber)) {
            setError("ID number must be 13 digits");
            return;
        }
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long, with at least one letter and one number");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
//==================END: Adding input validation        

        try {
            const result = await axios.post('http://localhost:5000/api/signup', {
                firstName,
                lastName,
                email,
                username,
                idNumber,
                accountNumber,
                password
            });
            console.log(result.data);
            alert("User registered successfully!");

            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('userId', result.data.userId);

            navigate('/dashboard');
            
   
        } catch (error) {
            console.error(error);
            setError("Error registering user. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter First Name"
                            autoComplete="off"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            autoComplete="off"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            autoComplete="off"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="idNumber"><strong>ID Number</strong></label>
                        <input
                            type="text"
                            placeholder="Enter ID Number"
                            autoComplete="off"
                            name="idNumber"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="accountNumber"><strong>Account Number</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Account Number"
                            autoComplete="off"
                            name="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
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
                    <div className="mb-3">
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                </form>
                <p>Already Have an Account</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;
