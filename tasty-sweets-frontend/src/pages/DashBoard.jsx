import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import styled from 'styled-components';
import SweetCard from '../components/SweetCard.jsx';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 40px;
  h2 {
    text-align: center;
    color: #343A40;
    margin-bottom: 30px;
    font-size: 2.5rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  input {
    width: 60%;
    max-width: 500px;
    padding: 12px 20px;
    border: 1px solid #CED4DA;
    border-radius: 8px;
    font-size: 1rem;
    transition: box-shadow 0.3s;
    &:focus {
      box-shadow: 0 0 0 3px rgba(164, 83, 142, 0.25);
      outline: none;
    }
  }
`;

const SweetList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchSweets = async () => {
        try {
            const response = await axiosInstance.get(`/sweets/search?name=${searchTerm}`);
            setSweets(response.data);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handlePurchase = async (id) => {
        try {
            await axiosInstance.post(`/sweets/${id}/purchase`);
            fetchSweets();
        } catch (error) {
            console.error('Failed to purchase sweet', error);
            alert('Failed to purchase sweet.');
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [searchTerm]);

    return (
        <DashboardContainer>
            <h2>Sweet Shop Delights</h2>
            <SearchBar>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchBar>
            <SweetList>
                
                {Array.isArray(sweets) && sweets.map((sweet) => (
                    <SweetCard key={sweet.id} sweet={sweet} onPurchase={handlePurchase} />
                ))}
            </SweetList>
        </DashboardContainer>
    );
};

export default Dashboard;