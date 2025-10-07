import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 8px;
  color: #343A40;
`;

const Details = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6C757D;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #A4538E;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

// Corrected ActionButton to use transient prop
const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: ${props => props.$isPrimary ? '#4CAF50' : '#A4538E'};
  &:hover {
    background-color: ${props => props.$isPrimary ? '#45A049' : '#8A417C'};
  }
  &:disabled {
    background-color: #E9ECEF;
    color: #6C757D;
    cursor: not-allowed;
  }
`;

const SweetCard = ({ sweet, onPurchase, onAddToCart }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  const imageUrl = sweet.imageUrl ? `${baseUrl}${sweet.imageUrl}` : '/path/to/a-placeholder-image.png';

  return (
    <StyledCard>
      <Image 
        src={imageUrl}
        alt={sweet.name} 
      />
      <CardContent>
        <Title>{sweet.name}</Title>
        <Details>Category: {sweet.category}</Details>
        <Price>Rs {sweet.price.toFixed(2)}</Price>
        <Details>In Stock: {sweet.quantity}</Details>
        <ButtonContainer>
          <ActionButton onClick={() => onAddToCart(sweet.id)} disabled={sweet.quantity === 0}>
            Add to Bag
          </ActionButton>
          {/* Corrected usage with $isPrimary */}
          <ActionButton $isPrimary onClick={() => onPurchase(sweet.id)} disabled={sweet.quantity === 0}>
            Purchase
          </ActionButton>
        </ButtonContainer>
      </CardContent>
    </StyledCard>
  );
};

export default SweetCard;