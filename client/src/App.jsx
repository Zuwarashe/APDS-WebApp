import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';  // Adjust path if necessary
import Payment from './Payment'; 
import EmployeeLogin from './EmployeeLogin';
import EmployeeDashboard from './EmployeeDashboard'; 
import PaymentVerification from './PaymentVerification';

import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
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
