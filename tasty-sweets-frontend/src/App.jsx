import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/DashBoard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Navbar from './components/Navbar.jsx';
import { createGlobalStyle } from 'styled-components';
import { jwtDecode } from 'jwt-decode';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #F8F9FA;
    color: #343A40;
  }
  h1, h2, h3 {
    font-weight: 600;
  }
`;

const checkAdminRole = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role === 'ROLE_ADMIN';
    } catch (error) {
        return false;
    }
};

const App = () => {
    const isAdmin = checkAdminRole();

    return (
        <Router>
            <GlobalStyle />
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin"
                    element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />}
                />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;