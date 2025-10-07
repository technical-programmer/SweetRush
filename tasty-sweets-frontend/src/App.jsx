import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/DashBoard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Navbar from './components/Navbar.jsx';
import CartPage from './pages/CartPage.jsx';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import axiosInstance from './api/axiosInstance.jsx'; 
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

const PrivateRoute = ({ children, isAdminRoute }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (isAdminRoute && !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <AuthProvider axiosInstance={axiosInstance}> {/* 👈 Pass it here */}
                <GlobalStyle />
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    
                    <Route 
                        path="/cart" 
                        element={
                            <PrivateRoute>
                                <CartPage />
                            </PrivateRoute>
                        } 
                    />

                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute isAdminRoute={true}>
                                <AdminPanel />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;