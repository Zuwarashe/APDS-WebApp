import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Import App.css for styling
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import Payment from './Payment';
import EmployeeLogin from './EmployeeLogin';
import EmployeeDashboard from './EmployeeDashboard';
import PaymentVerification from './PaymentVerification';

// HomePage Component
function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to PayGlobe</h1>
      <p>Your one-stop platform for secure payments worldwide.</p>
      <div>
        <Link to="/register" className="btn btn-primary me-2">Register</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
