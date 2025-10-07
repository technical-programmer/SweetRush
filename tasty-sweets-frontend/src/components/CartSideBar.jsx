import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100%;
  background: #f8f9fa;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.15);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  color: #343A40;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
  background-color: #A4538E;
  color: white;
  h3 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #e9ecef;
  }
`;

const SidebarContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const SweetItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ItemImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
  h4 {
    margin: 0 0 5px;
    font-size: 1.3rem;
    color: #343A40;
  }
  p {
    margin: 0;
    font-size: 0.95rem;
    color: #6C757D;
  }
  span {
    font-weight: 600;
    color: #A4538E;
  }
`;

const CheckoutButton = styled.button`
  width: calc(100% - 40px);
  margin: 20px;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45A049;
  }
`;

const CartSidebar = ({ sweet, onClose }) => {
  const navigate = useNavigate();

  if (!sweet) return null;

  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  const imageUrl = sweet.imageUrl ? `${baseUrl}${sweet.imageUrl}` : '/path/to/a-placeholder-image.png';

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Added to Bag</h3>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </SidebarHeader>
      <SidebarContent>
        <SweetItem>
          <ItemImage src={imageUrl} alt={sweet.name} />
          <ItemDetails>
            <h4>{sweet.name}</h4>
            <p>Category: {sweet.category}</p>
            <p>Price: <span>Rs {sweet.price.toFixed(2)}</span></p>
          </ItemDetails>
        </SweetItem>
      </SidebarContent>
      <CheckoutButton onClick={handleGoToCart}>
        Go to Bag
      </CheckoutButton>
    </SidebarContainer>
  );
};

export default CartSidebar;