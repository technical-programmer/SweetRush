import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // 👈 Import the useAuth hook

const CartPageContainer = styled.div`
    padding: 40px;
    max-width: 900px;
    margin: auto;
    h2 {
        text-align: center;
        color: #343A40;
        margin-bottom: 30px;
        font-size: 2.5rem;
    }
    .empty-cart, .loading-message {
        text-align: center;
        color: #6C757D;
        font-size: 1.2rem;
    }
`;

const CartItemsList = styled.div`
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    padding: 20px;
`;

const CartItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #E9ECEF;
    &:last-child {
        border-bottom: none;
    }
    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
`;

const ItemDetails = styled.div`
    flex: 1;
    margin-left: 20px;
    h4 {
        margin: 0 0 5px;
    }
    span {
        color: #A4538E;
        font-weight: 600;
    }
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    button {
        background-color: #A4538E;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 1rem;
        &:hover {
            background-color: #8A417C;
        }
    }
    span {
        font-size: 1.1rem;
        font-weight: 600;
    }
`;

const RemoveButton = styled.button`
    background-color: #DC3545;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.9rem;
    &:hover {
        background-color: #C82333;
    }
`;

const CheckoutSection = styled.div`
    margin-top: 30px;
    text-align: right;
    h3 {
        font-size: 1.5rem;
        color: #343A40;
    }
    button {
        padding: 12px 25px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 10px;
        &:hover {
            background-color: #45A049;
        }
    }
`;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
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
        alert('Proceeding to checkout...');
    };

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user, navigate]);

    return (
        <CartPageContainer>
            <h2>Your Shopping Bag</h2>
            {loading || authLoading ? (
                <p className="loading-message">Loading...</p>
            ) : cartItems.length > 0 ? (
                <CartItemsList>
                    {cartItems.map(item => (
                        <CartItem key={item.id}>
                            {/* Correct the image URL here */}
                            <img src={`${apiUrl}${item.sweet.imageUrl}`} alt={item.sweet.name} />
                            <ItemDetails>
                                <h4>{item.sweet.name}</h4>
                                <span>Rs {item.sweet.price.toFixed(2)}</span>
                            </ItemDetails>
                            <QuantityControl>
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </QuantityControl>
                            <RemoveButton onClick={() => handleRemoveItem(item.id)}>Remove</RemoveButton>
                        </CartItem>
                    ))}
                </CartItemsList>
            ) : (
                <p className="empty-cart">Your bag is empty.</p>
            )}
            <CheckoutSection>
                <h3>Total: Rs {total.toFixed(2)}</h3>
                {cartItems.length > 0 && (
                    <button onClick={handleCheckout}>Checkout</button>
                )}
            </CheckoutSection>
        </CartPageContainer>
    );
};

export default CartPage;