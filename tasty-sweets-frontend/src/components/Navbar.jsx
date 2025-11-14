import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';

const Nav = styled.nav`
  background: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff'};
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.05)'};
  padding: 1.2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (max-width: 968px) {
    padding: 1rem 1.5rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBrand = styled(Link)`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 968px) {
    font-size: 1.5rem;
  }
`;

const BrandIcon = styled.span`
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 968px) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-150%)'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 999;
  }
`;

const NavLink = styled(Link)`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$active ? '#667eea' : '#343A40'};
  text-decoration: none;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '80%' : '0'};
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    
    &::before {
      width: 80%;
    }
  }

  @media (max-width: 968px) {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
`;

const AuthControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 968px) {
    gap: 0.5rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  }

  @media (max-width: 968px) {
    padding: 0.4rem 0.8rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);

  @media (max-width: 968px) {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
`;

const WelcomeMessage = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #343A40;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  background: ${props => props.$primary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#FFFFFF' : '#667eea'};
  padding: 0.7rem 1.5rem;
  border: ${props => props.$primary ? 'none' : '2px solid #667eea'};
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$primary ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$primary ? '0 6px 20px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(102, 126, 234, 0.2)'};
    background: ${props => props.$primary ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4394 100%)' : 'rgba(102, 126, 234, 0.05)'};
  }

  @media (max-width: 968px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4394 100%);
  }

  @media (max-width: 968px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;

  @media (max-width: 968px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const MenuLine = styled.span`
  width: 25px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;

  ${props => props.$isOpen && props.$first && `
    transform: rotate(45deg) translateY(8px);
  `}
  
  ${props => props.$isOpen && props.$middle && `
    opacity: 0;
    transform: translateX(-20px);
  `}
  
  ${props => props.$isOpen && props.$last && `
    transform: rotate(-45deg) translateY(-8px);
  `}
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.4);
`;

const CartButton = styled(Link)`
  position: relative;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #343A40;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
    color: #667eea;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <Nav $scrolled={scrolled}>
      <NavContainer>
        <NavBrand to="/">
          <BrandIcon>🍬</BrandIcon>
          SweetRush
        </NavBrand>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <MenuLine $isOpen={mobileMenuOpen} $first />
          <MenuLine $isOpen={mobileMenuOpen} $middle />
          <MenuLine $isOpen={mobileMenuOpen} $last />
        </MobileMenuButton>

        <NavLinks $isOpen={mobileMenuOpen}>
          <NavLink to="/" $active={location.pathname === '/'}>
            🏠 Home
          </NavLink>
          {user && (
            <CartButton to="/cart">
              🛒 Cart
              
            </CartButton>
          )}
          {user?.isAdmin && (
            <NavLink to="/admin" $active={location.pathname === '/admin'}>
              ⚙️ Admin
            </NavLink>
          )}
        </NavLinks>

        <AuthControls>
          {user ? (
            <>
              <UserSection>
                <UserAvatar>{getInitials(user.username)}</UserAvatar>
                <WelcomeMessage>{user.username}</WelcomeMessage>
              </UserSection>
              <LogoutButton onClick={logout}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <AuthButton to="/login">Login</AuthButton>
              <AuthButton to="/register" $primary>Sign Up</AuthButton>
            </>
          )}
        </AuthControls>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;