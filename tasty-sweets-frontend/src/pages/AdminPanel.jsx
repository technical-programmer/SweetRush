import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const AdminPanelContainer = styled.div`
    max-width: 1200px;
    margin: 40px auto;
    padding: 40px 20px;
    animation: ${fadeIn} 0.6s ease;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 50px;
    
    h1 {
        font-size: 3rem;
        background: linear-gradient(135deg, #A4538E, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px;
        font-weight: 800;
    }
    
    p {
        color: #7F8C8D;
        font-size: 1.1rem;
    }
`;

const FormSection = styled.div`
    background: white;
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    
    h2 {
        font-size: 1.8rem;
        color: #2C3E50;
        margin: 0 0 30px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        
        &::before {
            content: '📝';
            font-size: 2rem;
        }
    }
`;

const Form = styled.form`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-weight: 600;
    color: #2C3E50;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const Input = styled.input`
    padding: 14px 16px;
    border-radius: 12px;
    border: 2px solid #E9ECEF;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #F8F9FA;
    
    &:focus {
        outline: none;
        border-color: #A4538E;
        background: white;
        box-shadow: 0 0 0 3px rgba(164, 83, 142, 0.1);
    }
    
    &::placeholder {
        color: #ADB5BD;
    }
`;

const FileInputWrapper = styled.div`
    position: relative;
    grid-column: 1 / -1;
`;

const FileInput = styled.input`
    display: none;
`;

const FileLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px;
    border-radius: 12px;
    border: 2px dashed #A4538E;
    background: linear-gradient(135deg, rgba(164, 83, 142, 0.05), rgba(118, 75, 162, 0.05));
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    color: #A4538E;
    
    &:hover {
        background: linear-gradient(135deg, rgba(164, 83, 142, 0.1), rgba(118, 75, 162, 0.1));
        border-color: #764ba2;
    }
    
    &::before {
        content: '📁';
        font-size: 1.5rem;
    }
`;

const FileName = styled.span`
    color: #6C757D;
    font-size: 0.9rem;
    margin-top: 8px;
    display: block;
`;

const SubmitButton = styled.button`
    grid-column: 1 / -1;
    padding: 16px 32px;
    background: linear-gradient(135deg, #A4538E, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(164, 83, 142, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(164, 83, 142, 0.4);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const TableSection = styled.div`
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    
    h2 {
        font-size: 1.8rem;
        color: #2C3E50;
        margin: 0 0 30px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        
        &::before {
            content: '🍬';
            font-size: 2rem;
        }
    }
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const SweetTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    
    thead {
        background: linear-gradient(135deg, #A4538E, #764ba2);
        
        th {
            padding: 18px 16px;
            text-align: left;
            color: white;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }
    }
    
    tbody {
        tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid #F0F0F0;
            
            &:hover {
                background: linear-gradient(135deg, rgba(164, 83, 142, 0.03), rgba(118, 75, 162, 0.03));
                transform: scale(1.01);
            }
            
            &:last-child {
                border-bottom: none;
            }
        }
        
        td {
            padding: 16px;
            color: #2C3E50;
            font-weight: 500;
        }
    }
`;

const ImageCell = styled.td`
    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.1);
        }
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    
    &.edit-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
        }
    }
    
    &.delete-btn {
        background: linear-gradient(135deg, #E74C3C, #C0392B);
        color: white;
        box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
        }
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

const PriceTag = styled.span`
    background: linear-gradient(135deg, rgba(164, 83, 142, 0.1), rgba(118, 75, 162, 0.1));
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 700;
    color: #A4538E;
    display: inline-block;
`;

const CategoryBadge = styled.span`
    background: linear-gradient(135deg, #4CAF50, #45A049);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-block;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 60px;
    font-size: 1.2rem;
    color: #7F8C8D;
    
    &::before {
        content: '⏳';
        font-size: 3rem;
        display: block;
        margin-bottom: 20px;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px;
    color: #7F8C8D;
    
    &::before {
        content: '🍭';
        font-size: 4rem;
        display: block;
        margin-bottom: 20px;
    }
    
    p {
        font-size: 1.2rem;
        margin: 0;
    }
`;

const AdminPanel = () => {
    const [sweets, setSweets] = useState([]);
    const [formState, setFormState] = useState({ 
        id: null, 
        name: '', 
        category: '', 
        price: '', 
        quantity: '', 
        imageUrl: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const fetchSweets = async () => {
        setLocalLoading(true);
        try {
            const response = await axiosInstance.get('/sweets');
            setSweets(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Session expired. Please log in again.');
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
        setIsSubmitting(true);
        
        try {
            if (formState.id) {
                const formData = new FormData();
                formData.append('name', formState.name);
                formData.append('category', formState.category);
                formData.append('price', formState.price);
                formData.append('quantity', formState.quantity);
                
                if (imageFile) {
                    formData.append('image', imageFile);
                }
                
                await axiosInstance.put(`/sweets/${formState.id}`, formData);
                alert('✅ Sweet updated successfully!');
                
            } else {
                if (!imageFile) {
                    alert('⚠️ Please select an image!');
                    setIsSubmitting(false);
                    return;
                }
                
                const formData = new FormData();
                formData.append('name', formState.name);
                formData.append('category', formState.category);
                formData.append('price', formState.price);
                formData.append('quantity', formState.quantity);
                formData.append('image', imageFile);
                
                await axiosInstance.post('/sweets', formData);
                alert('✅ Sweet added successfully!');
            }
            
            setFormState({ id: null, name: '', category: '', price: '', quantity: '', imageUrl: '' });
            setImageFile(null);
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';
            
            await fetchSweets();
            
        } catch (error) {
            if (error.response?.status === 401) {
                alert('⚠️ Session expired. Please log in again.');
                navigate('/login');
            } else if (error.response?.status === 403) {
                alert('⚠️ You do not have permission to perform this action.');
            } else {
                const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
                alert(`❌ Operation failed!\n\n${errorMsg}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (sweet) => {
        setFormState({ ...sweet });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sweet? 🗑️\n\nThis action cannot be undone.')) {
            return;
        }
        
        try {
            await axiosInstance.delete(`/sweets/${id}`);
            
            alert('✅ Sweet deleted successfully!');
            
            await fetchSweets();
            
        } catch (error) {
            if (error.response?.status === 401) {
                alert('⚠️ Session expired. Please log in again.');
                navigate('/login');
            } else if (error.response?.status === 403) {
                alert('⚠️ You do not have permission to delete sweets.');
            } else if (error.response?.status === 409 || 
                       error.response?.data?.error?.includes('foreign key') ||
                       error.response?.data?.error?.includes('cart')) {
                alert('⚠️ Cannot delete this sweet!\n\n' +
                      'This sweet is currently in one or more shopping carts.\n' +
                      'Users must remove it from their carts before you can delete it.');
            } else if (error.response?.status === 404) {
                alert('⚠️ Sweet not found. It may have already been deleted.');
                await fetchSweets();
            } else {
                const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
                alert(`❌ Delete failed!\n\n${errorMsg}`);
            }
        }
    };
    
    if (authLoading || localLoading) {
        return (
            <AdminPanelContainer>
                <LoadingMessage>Loading Admin Panel...</LoadingMessage>
            </AdminPanelContainer>
        );
    }

    return (
        <AdminPanelContainer>
            <Header>
                <h1>🎯 Admin Dashboard</h1>
                <p>Manage your sweet inventory with ease</p>
            </Header>

            <FormSection>
                <h2>{formState.id ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                <Form onSubmit={handleFormSubmit}>
                    <InputGroup>
                        <Label>🍬 Sweet Name</Label>
                        <Input 
                            type="text" 
                            name="name" 
                            placeholder="e.g., Gulab Jamun" 
                            value={formState.name} 
                            onChange={handleFormChange} 
                            required 
                            disabled={isSubmitting}
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label>📂 Category</Label>
                        <Input 
                            type="text" 
                            name="category" 
                            placeholder="e.g., Dessert" 
                            value={formState.category} 
                            onChange={handleFormChange} 
                            required 
                            disabled={isSubmitting}
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label>💰 Price (₹)</Label>
                        <Input 
                            type="number" 
                            name="price" 
                            placeholder="100" 
                            value={formState.price} 
                            onChange={handleFormChange} 
                            required 
                            min="0"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label>📦 Quantity</Label>
                        <Input 
                            type="number" 
                            name="quantity" 
                            placeholder="50" 
                            value={formState.quantity} 
                            onChange={handleFormChange} 
                            required 
                            min="0"
                            disabled={isSubmitting}
                        />
                    </InputGroup>
                    
                    <FileInputWrapper>
                        <FileInput 
                            type="file" 
                            id="file-upload"
                            onChange={handleFileChange}
                            accept="image/*"
                            disabled={isSubmitting}
                        />
                        <FileLabel htmlFor="file-upload">
                            {imageFile ? imageFile.name : (formState.id ? 'Change Image (Optional)' : 'Choose Image File')}
                        </FileLabel>
                        {imageFile && <FileName>✅ {imageFile.name}</FileName>}
                        {formState.id && !imageFile && formState.imageUrl && (
                            <FileName>Current image will be kept if not changed</FileName>
                        )}
                    </FileInputWrapper>
                    
                    <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '⏳ Processing...' : (formState.id ? '✏️ Update Sweet' : '➕ Add Sweet')}
                    </SubmitButton>
                </Form>
            </FormSection>
            
            <TableSection>
                <h2>Manage Sweets</h2>
                {sweets.length === 0 ? (
                    <EmptyState>
                        <p>No sweets available. Add your first sweet above!</p>
                    </EmptyState>
                ) : (
                    <TableWrapper>
                        <SweetTable>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map(sweet => (
                                    <tr key={sweet.id}>
                                        <ImageCell>
                                            <img 
                                                src={sweet.imageUrl}
                                                alt={sweet.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                }}
                                            />
                                        </ImageCell>
                                        <td>{sweet.name}</td>
                                        <td><CategoryBadge>{sweet.category}</CategoryBadge></td>
                                        <td><PriceTag>₹{sweet.price.toFixed(2)}</PriceTag></td>
                                        <td>{sweet.quantity} units</td>
                                        <td>
                                            <ActionButtons>
                                                <ActionButton 
                                                    className="edit-btn" 
                                                    onClick={() => handleEdit(sweet)}
                                                    disabled={isSubmitting}
                                                >
                                                    ✏️ Edit
                                                </ActionButton>
                                                <ActionButton 
                                                    className="delete-btn" 
                                                    onClick={() => handleDelete(sweet.id)}
                                                    disabled={isSubmitting}
                                                >
                                                    🗑️ Delete
                                                </ActionButton>
                                            </ActionButtons>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </SweetTable>
                    </TableWrapper>
                )}
            </TableSection>
        </AdminPanelContainer>
    );
};

export default AdminPanel;