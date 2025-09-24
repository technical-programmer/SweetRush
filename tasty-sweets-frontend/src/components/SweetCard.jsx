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

const PurchaseButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4CAF50;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45A049;
  }
  &:disabled {
    background-color: #E9ECEF;
    color: #6C757D;
    cursor: not-allowed;
  }
`;

const SweetCard = ({ sweet, onPurchase }) => {
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
                <PurchaseButton onClick={() => onPurchase(sweet.id)} disabled={sweet.quantity === 0}>
                    Purchase
                </PurchaseButton>
            </CardContent>
        </StyledCard>
    );
};

export default SweetCard;