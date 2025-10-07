import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminPanelContainer = styled.div`
    max-width: 900px;
    margin: 40px auto;
    padding: 40px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    h2 {
        text-align: center;
        color: #343A40;
        margin-bottom: 24px;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 40px;
    input, button {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #CED4DA;
        font-size: 1rem;
    }
    input[type="file"] {
        border: none;
    }
    button {
        background-color: #A4538E;
        color: #FFFFFF;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        transition: background-color 0.3s;
        &:hover {
            background-color: #8C4578;
        }
        &.delete-btn {
            background-color: #DC3545;
            &:hover {
                background-color: #C82333;
            }
        }
    }
`;

const SweetTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 12px;
        border: 1px solid #E9ECEF;
        text-align: left;
    }
    th {
        background-color: #F8F9FA;
        font-weight: 600;
    }
    img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
    }
    button {
        background-color: #A4538E;
        color: #FFFFFF;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #8C4578;
        }
        &.delete-btn {
            background-color: #DC3545;
            &:hover {
                background-color: #C82333;
            }
        }
    }
`;

const AdminPanel = () => {
    const [sweets, setSweets] = useState([]);
    const [formState, setFormState] = useState({ id: null, name: '', category: '', price: '', quantity: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchSweets = async () => {
        setLocalLoading(true);
        try {
            const response = await axiosInstance.get('/sweets');
            setSweets(response.data);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLocalLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSweets();
        }
    }, [user]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        let newImageUrl = formState.imageUrl;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            try {
                const uploadResponse = await axiosInstance.post('/sweets/upload-image', formData);
                newImageUrl = uploadResponse.data;
            } catch (error) {
                alert('Image upload failed!');
                return;
            }
        }

        const sweetData = { ...formState, imageUrl: newImageUrl };
        delete sweetData.id;

        try {
            if (formState.id) {
                await axiosInstance.put(`/sweets/${formState.id}`, sweetData);
                alert('Sweet updated successfully!');
            } else {
                await axiosInstance.post('/sweets', sweetData);
                alert('Sweet added successfully!');
            }
            setFormState({ id: null, name: '', category: '', price: '', quantity: '', imageUrl: '' });
            setImageFile(null);
            fetchSweets();
        } catch (error) {
            console.error('Operation failed:', error);
            alert('Operation failed!');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleEdit = (sweet) => {
        setFormState({ ...sweet });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await axiosInstance.delete(`/sweets/${id}`);
                alert('Sweet deleted successfully!');
                fetchSweets();
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Delete failed!');
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        }
    };
    
    if (authLoading || localLoading) {
        return <AdminPanelContainer><p>Loading sweets...</p></AdminPanelContainer>;
    }

    return (
        <AdminPanelContainer>
            <h2>{formState.id ? 'Edit Sweet' : 'Add New Sweet'}</h2>
            <Form onSubmit={handleFormSubmit}>
                <input type="text" name="name" placeholder="Name" value={formState.name} onChange={handleFormChange} required />
                <input type="text" name="category" placeholder="Category" value={formState.category} onChange={handleFormChange} required />
                <input type="number" name="price" placeholder="Price" value={formState.price} onChange={handleFormChange} required />
                <input type="number" name="quantity" placeholder="Quantity" value={formState.quantity} onChange={handleFormChange} required />
                <input type="file" onChange={handleFileChange} />
                <button type="submit">{formState.id ? 'Update Sweet' : 'Add Sweet'}</button>
            </Form>
            
            <h2>Manage Sweets</h2>
            <SweetTable>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sweets.map(sweet => (
                        <tr key={sweet.id}>
                            <td>
                                <img 
                                    src={sweet.imageUrl} 
                                    alt={sweet.name} 
                                />
                            </td>
                            <td>{sweet.name}</td>
                            <td>{sweet.category}</td>
                            <td>${sweet.price}</td>
                            <td>
                                <button onClick={() => handleEdit(sweet)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(sweet.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </SweetTable>
        </AdminPanelContainer>
    );
};

export default AdminPanel;