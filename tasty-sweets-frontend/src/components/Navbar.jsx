import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';

const Nav = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    text-align: center;
  }
`;

const NavBrand = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #A4538E;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 1rem;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #343A40;
  cursor: pointer;
  margin: 0 1rem;
  transition: color 0.2s;

  &:hover {
    color: #A4538E;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const AuthControls = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 1rem;
  }
`;

const WelcomeMessage = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #6C757D;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }
`;

const AuthButton = styled(Link)`
  background-color: #A4538E;
  color: #FFFFFF;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #8C4578;
  }
`;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // The payload's roles field is an array of objects
        // We need to check if one of those objects has a name of 'ROLE_ADMIN'
        const roles = decodedToken.roles.map(role => role.authority);
        setUser({
          username: decodedToken.sub,
          roles: roles,
        });
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <Nav>
      <NavBrand to="/">SweetRush</NavBrand>
      <NavLinks>
        <NavButton as={Link} to="/">Home</NavButton>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <NavButton as={Link} to="/admin">Admin Panel</NavButton>
        )}
      </NavLinks>
      <AuthControls>
        {user ? (
          <>
            <WelcomeMessage>Welcome, {user.username}!</WelcomeMessage>
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          </>
        ) : (
          <>
            <AuthButton to="/login">Login</AuthButton>
            <AuthButton to="/register" style={{ backgroundColor: '#4CAF50' }}>Register</AuthButton>
          </>
        )}
      </AuthControls>
    </Nav>
  );
};

export default Navbar;