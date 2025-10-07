import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, axiosInstance }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const decodeAndSetUser = (token) => {
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role; // 👈 Correctly get the role as a single string
            
            setUser({
                username: decodedToken.sub,
                role: userRole,
                isAuthenticated: true,
                isAdmin: userRole === 'ROLE_ADMIN' // 👈 Correctly check the role string
            });
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            decodeAndSetUser(token);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role; // 👈 Correctly get the role as a single string

            const newUser = {
                username: decodedToken.sub,
                role: userRole,
                isAuthenticated: true,
                isAdmin: userRole === 'ROLE_ADMIN' // 👈 Correctly check the role string
            };
            setUser(newUser);
            
            if (newUser.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);