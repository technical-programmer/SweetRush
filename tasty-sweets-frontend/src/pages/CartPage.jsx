import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CartPageContainer = styled.div`
    padding: 40px 20px;
    max-width: 1000px;
    margin: auto;
    min-height: 80vh;
    
    h2 {
        text-align: center;
        color: #2C3E50;
        margin-bottom: 40px;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    
    .empty-cart, .loading-message {
        text-align: center;
        color: #7F8C8D;
        font-size: 1.2rem;
        padding: 60px 20px;
    }
`;

const CartItemsList = styled.div`
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
    padding: 30px;
    margin-bottom: 30px;
`;

const CartItem = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #F0F0F0;
    
    &:last-child {
        border-bottom: none;
    }
    
    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 15px;
    }
    
    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.05);
        }
    }
`;

const ItemDetails = styled.div`
    flex: 1;
    min-width: 150px;
    
    h4 {
        margin: 0 0 8px;
        font-size: 1.1rem;
        color: #2C3E50;
        font-weight: 600;
    }
    
    .price {
        color: #A4538E;
        font-weight: 700;
        font-size: 1.2rem;
    }
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: #F8F9FA;
    padding: 8px 12px;
    border-radius: 25px;
    
    button {
        background-color: #A4538E;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-weight: 600;
        
        &:hover {
            background-color: #8A417C;
            transform: scale(1.1);
        }
        
        &:active {
            transform: scale(0.95);
        }
    }
    
    span {
        font-size: 1.1rem;
        font-weight: 600;
        min-width: 30px;
        text-align: center;
        color: #2C3E50;
    }
`;

const RemoveButton = styled.button`
    background-color: transparent;
    color: #E74C3C;
    border: 2px solid #E74C3C;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #E74C3C;
        color: white;
        transform: translateY(-2px);
    }
`;

const CheckoutSection = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 30px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    
    .total-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        @media (max-width: 768px) {
            flex-direction: column;
            gap: 15px;
        }
    }
    
    h3 {
        font-size: 1.8rem;
        margin: 0;
        font-weight: 700;
    }
    
    button {
        padding: 14px 40px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        
        &:hover {
            background-color: #45A049;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
        }
        
        &:active {
            transform: translateY(0);
        }
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

const checkmark = keyframes`
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
    backdrop-filter: blur(5px);
`;

const PopupContent = styled.div`
    background: white;
    border-radius: 24px;
    padding: 50px 40px;
    text-align: center;
    max-width: 450px;
    width: 90%;
    animation: ${slideUp} 0.4s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
    animation: ${checkmark} 0.6s ease;
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

const PopupMessage = styled.p`
    color: #7F8C8D;
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

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/cart');
            setCartItems(response.data);
            const totalAmount = response.data.reduce((sum, item) => sum + item.sweet.price * item.quantity, 0);
            setTotal(totalAmount);
        } catch (error) {
            console.error('Failed to fetch cart items', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axiosInstance.put(`/cart/${itemId}`, { quantity: newQuantity });
            fetchCartItems();
        } catch (error) {
            console.error('Failed to update quantity', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                await axiosInstance.delete(`/cart/${itemId}`);
                fetchCartItems();
            } catch (error) {
                console.error("Failed to remove item", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        }
    };

    const handleCheckout = () => {
        setShowPopup(true);
        // Optional: Clear cart after order (uncomment if needed)
        // setTimeout(() => {
        //     setCartItems([]);
        //     setTotal(0);
        // }, 2000);
    };

    const closePopup = () => {
        setShowPopup(false);
        // Optional: Navigate to home or orders page
        // navigate('/');
    };

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user]);

    return (
        <>
            <CartPageContainer>
                <h2>🛍️ Your Shopping Bag</h2>
                {loading || authLoading ? (
                    <p className="loading-message">Loading your cart...</p>
                ) : cartItems.length > 0 ? (
                    <>
                        <CartItemsList>
                            {cartItems.map(item => (
                                <CartItem key={item.id}>
                                    <img src={`${apiUrl}${item.sweet.imageUrl}`} alt={item.sweet.name} />
                                    <ItemDetails>
                                        <h4>{item.sweet.name}</h4>
                                        <span className="price">₹{item.sweet.price.toFixed(2)}</span>
                                    </ItemDetails>
                                    <QuantityControl>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </QuantityControl>
                                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>Remove</RemoveButton>
                                </CartItem>
                            ))}
                        </CartItemsList>
                        <CheckoutSection>
                            <div className="total-container">
                                <h3>Total Amount: ₹{total.toFixed(2)}</h3>
                                <button onClick={handleCheckout}>Proceed to Checkout</button>
                            </div>
                        </CheckoutSection>
                    </>
                ) : (
                    <p className="empty-cart">Your cart is empty. Start shopping! 🛒</p>
                )}
            </CartPageContainer>

            {showPopup && (
                <PopupOverlay onClick={closePopup}>
                    <PopupContent onClick={(e) => e.stopPropagation()}>
                        <CheckmarkCircle>
                            <svg viewBox="0 0 52 52">
                                <path d="M14 27l8 8 16-16" />
                            </svg>
                        </CheckmarkCircle>
                        <PopupTitle>Order Placed Successfully! 🎉</PopupTitle>
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

export default CartPage;