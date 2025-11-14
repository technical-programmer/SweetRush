import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Card Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const StyledCard = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${fadeInUp} 0.6s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 240px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${StyledCard}:hover & {
    transform: scale(1.1);
  }
`;

const StockBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => props.$inStock ? 'linear-gradient(135deg, #4CAF50, #45A049)' : 'linear-gradient(135deg, #E74C3C, #C0392B)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(164, 83, 142, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 1;
`;

const CardContent = styled.div`
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(to bottom, #FFFFFF, #FAFAFA);
`;

const Title = styled.h3`
  font-size: 1.6rem;
  margin: 0 0 10px;
  color: #2C3E50;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 15px 0;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #A4538E, #E74C3C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PriceLabel = styled.span`
  font-size: 0.9rem;
  color: #7F8C8D;
  font-weight: 500;
`;

const StockInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(164, 83, 142, 0.05), rgba(76, 175, 80, 0.05));
  border-radius: 10px;
  
  span {
    font-size: 0.9rem;
    color: #6C757D;
    font-weight: 600;
  }
  
  strong {
    color: #A4538E;
    font-size: 1.1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${props => props.$isPrimary 
    ? 'linear-gradient(135deg, #4CAF50, #45A049)' 
    : 'linear-gradient(135deg, #A4538E, #8A417C)'};
  
  box-shadow: ${props => props.$isPrimary 
    ? '0 4px 15px rgba(76, 175, 80, 0.3)' 
    : '0 4px 15px rgba(164, 83, 142, 0.3)'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.$isPrimary 
      ? '0 6px 20px rgba(76, 175, 80, 0.4)' 
      : '0 6px 20px rgba(164, 83, 142, 0.4)'};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #E9ECEF, #DEE2E6);
    color: #ADB5BD;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
`;

// Popup Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(8px);
`;

const PopupContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 50px 40px;
  text-align: center;
  max-width: 480px;
  width: 90%;
  animation: ${slideUp} 0.4s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CheckmarkCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45A049);
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${checkmarkAnimation} 0.6s ease;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
  
  svg {
    width: 50px;
    height: 50px;
    stroke: white;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const PopupTitle = styled.h2`
  color: #2C3E50;
  font-size: 2rem;
  margin: 0 0 15px;
  font-weight: 700;
`;

const PopupEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  animation: ${checkmarkAnimation} 0.6s ease;
  animation-delay: 0.2s;
  animation-fill-mode: backwards;
`;

const PopupMessage = styled.p`
  color: #95A5A6;
  font-size: 1.1rem;
  margin: 0 0 30px;
  line-height: 1.6;
`;

const PopupButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SweetCard = ({ sweet, onPurchase, onAddToCart }) => {
  const [showPopup, setShowPopup] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  const imageUrl = sweet.imageUrl ? `${baseUrl}${sweet.imageUrl}` : '/path/to/a-placeholder-image.png';

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(sweet.id);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <StyledCard>
        <ImageContainer>
          <Image 
            src={imageUrl}
            alt={sweet.name} 
          />
          <CategoryBadge>{sweet.category}</CategoryBadge>
          <StockBadge $inStock={sweet.quantity > 0}>
            {sweet.quantity > 0 ? `${sweet.quantity} in Stock` : 'Out of Stock'}
          </StockBadge>
        </ImageContainer>
        
        <CardContent>
          <Title>{sweet.name}</Title>
          
          <PriceContainer>
            <PriceLabel>₹</PriceLabel>
            <Price>{sweet.price.toFixed(2)}</Price>
          </PriceContainer>
          
          <StockInfo>
            <span>Available:</span>
            <strong>{sweet.quantity} units</strong>
          </StockInfo>
          
          <ButtonContainer>
            <ActionButton 
              onClick={() => onAddToCart(sweet.id)} 
              disabled={sweet.quantity === 0}
            >
              🛒 Add to Cart
            </ActionButton>
            <ActionButton 
              $isPrimary 
              onClick={handlePurchase} 
              disabled={sweet.quantity === 0}
            >
              ⚡ Buy Now
            </ActionButton>
          </ButtonContainer>
        </CardContent>
      </StyledCard>

      {showPopup && (
        <PopupOverlay onClick={closePopup}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <CheckmarkCircle>
              <svg viewBox="0 0 52 52">
                <path d="M14 27l8 8 16-16" />
              </svg>
            </CheckmarkCircle>
            
            <PopupTitle>Order Placed Successfully!</PopupTitle>
            <PopupEmoji>🎉</PopupEmoji>
            
            <PopupMessage>
              Thank you for your order! Your delicious sweets will be delivered soon.
            </PopupMessage>
            
            <PopupButton onClick={closePopup}>Continue Shopping</PopupButton>
          </PopupContent>
        </PopupOverlay>
      )}
    </>
  );
};

export default SweetCard;