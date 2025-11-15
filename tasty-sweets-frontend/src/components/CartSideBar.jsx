import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
  transform: translateX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  color: #1a1a1a;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 24px;
  background: linear-gradient(135deg, #A4538E 0%, #8B4378 100%);
  color: white;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    position: relative;
    z-index: 1;
  }
`;

const SuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(76, 175, 80, 0.2);
  border-radius: 50%;
  margin-right: 12px;
  animation: scaleIn 0.3s ease-out;

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  &::after {
    content: '✓';
    color: #4CAF50;
    font-size: 16px;
    font-weight: bold;
  }
`;

const CloseButton = styled.button`
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
  }
`;

const SidebarContent = styled.div`
  flex-grow: 1;
  padding: 32px 24px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`;

const SweetItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ItemImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: transform 0.3s ease;

  ${ItemImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ItemBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
`;

const ItemDetails = styled.div`
  flex-grow: 1;
  
  h4 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
  }
  
  p {
    margin: 6px 0;
    font-size: 0.9rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #4b5563;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
`;

const PriceTag = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #A4538E;
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;

  span {
    font-size: 0.9rem;
    font-weight: 600;
    color: #6b7280;
  }
`;

const ButtonContainer = styled.div`
  padding: 20px 24px 24px;
  border-top: 1px solid #e5e7eb;
  background: white;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(76, 175, 80, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContinueShopping = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 12px;
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #A4538E;
    color: #A4538E;
    background: rgba(164, 83, 142, 0.05);
  }
`;

const CartSidebar = ({ sweet, onClose }) => {
  const navigate = useNavigate();

  if (!sweet) return null;

  // Use imageUrl directly - it's already a complete Cloudinary URL
  const imageUrl = sweet.imageUrl || '/placeholder-sweet.png';

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SuccessIcon />
          <h3>Added to Bag</h3>
        </div>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </SidebarHeader>
      
      <SidebarContent>
        <SweetItem>
          <ItemImageWrapper>
            <ItemImage 
              src={imageUrl} 
              alt={sweet.name}
              onError={(e) => {
                e.target.src = '/placeholder-sweet.png';
              }}
            />
            <ItemBadge>NEW</ItemBadge>
          </ItemImageWrapper>
          
          <ItemDetails>
            <h4>{sweet.name}</h4>
            <CategoryTag>{sweet.category}</CategoryTag>
            <PriceTag>
              <span>Rs</span> {sweet.price.toFixed(2)}
            </PriceTag>
          </ItemDetails>
        </SweetItem>
      </SidebarContent>
      
      <ButtonContainer>
        <CheckoutButton onClick={handleGoToCart}>
          Go to Bag →
        </CheckoutButton>
        <ContinueShopping onClick={onClose}>
          Continue Shopping
        </ContinueShopping>
      </ButtonContainer>
    </SidebarContainer>
  );
};

export default CartSidebar;