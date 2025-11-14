import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import styled from 'styled-components';
import SweetCard from '../components/SweetCard.jsx';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../components/CartSideBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 60px 40px;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  animation: fadeInDown 0.6s ease-out;
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  color: #2D3748;
  margin-bottom: 12px;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  animation: fadeIn 0.8s ease-out 0.2s both;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #A0AEC0;
  font-size: 1.2rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 18px 20px 18px 55px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 1rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #A0AEC0;
  }
`;

const SweetList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 35px;
  animation: fadeInUp 1s ease-out 0.3s both;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  grid-column: 1 / -1;
  
  svg {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.3;
  }
  
  h3 {
    color: #4A5568;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  p {
    color: #A0AEC0;
    font-size: 1rem;
  }
`;

const LoadingSpinner = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  
  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 4px solid #E2E8F0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSweet, setSelectedSweet] = useState(null);
    const { user } = useAuth();

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/sweets/search?name=${searchTerm}`);
            setSweets(response.data);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (id, quantity = 1) => {
        try {
            await axiosInstance.post(`/sweets/${id}/purchase`, { quantity }); 
            fetchSweets();
            alert(`Successfully purchased ${quantity} item(s)!`);
            if (isSidebarOpen) {
                setIsSidebarOpen(false); 
            }
        } catch (error) {
            console.error('Failed to purchase sweet', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Failed to purchase sweet.');
            }
        }
    };

    const handleAddToCart = async (sweet) => {
        try {
            const quantity = 1;
            await axiosInstance.post('/cart/add', { sweetId: sweet.id, quantity });
            setSelectedSweet(sweet);
            setIsSidebarOpen(true);
        } catch (error) {
            console.error('Failed to add sweet to bag', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Failed to add sweet to bag.');
            }
        }
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    useEffect(() => {
        fetchSweets();
    }, [searchTerm]);

    return (
        <DashboardContainer>
            <Header>
                <Title>Sweet Shop Delights</Title>
                <Subtitle>Discover our delicious collection of handcrafted sweets</Subtitle>
            </Header>
            
            <SearchBarContainer>
                <SearchWrapper>
                    <SearchIcon>🔍</SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Search for your favorite sweets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchWrapper>
            </SearchBarContainer>
            
            <SweetList>
                {loading ? (
                    <LoadingSpinner />
                ) : Array.isArray(sweets) && sweets.length > 0 ? (
                    sweets.map((sweet) => (
                        <SweetCard 
                            key={sweet.id} 
                            sweet={sweet} 
                            onPurchase={handlePurchase}
                            onAddToCart={() => handleAddToCart(sweet)} 
                        />
                    ))
                ) : (
                    <EmptyState>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <h3>No sweets found</h3>
                        <p>Try adjusting your search to find what you're looking for</p>
                    </EmptyState>
                )}
            </SweetList>
            
            {isSidebarOpen && (
                <CartSidebar 
                    sweet={selectedSweet} 
                    onClose={handleCloseSidebar}
                    onPurchase={handlePurchase}
                />
            )}
        </DashboardContainer>
    );
};

export default Dashboard;