import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FormContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background: #ffffff;

  animation: fadeIn 0.8s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 45px 40px;

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);

  border-radius: 22px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.10),
    0 8px 18px rgba(0, 0, 0, 0.06);
  
  animation: slideUp 0.8s ease;
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(25px); }
    to { opacity: 1; transform: translateY(0); }
  }

  transition: 0.3s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 28px 55px rgba(0, 0, 0, 0.18),
      0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #3f3f3f;
  font-weight: 800;
  font-size: 1.9rem;
  margin-bottom: 30px;

  animation: fadeDown 0.7s ease;
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;

  border-radius: 12px;
  border: 1.4px solid #d7d7d7;
  background: #fafafa;

  font-size: 1.02rem;

  transition: 0.25s ease;

  &:focus {
    border-color: #8c5eff;
    box-shadow: 0 0 12px rgba(140, 94, 255, 0.25);
    outline: none;
    background: #fff;
  }

  &:hover {
    border-color: #b389ff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 10px;

  background: linear-gradient(135deg, #9b4dff, #6a4fff);
  color: white;

  border: none;
  border-radius: 12px;

  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  cursor: pointer;
  transition: 0.25s ease;

  animation: popIn 0.9s ease;
  @keyframes popIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 25px rgba(128, 82, 255, 0.3);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        username,
        password,
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Username may be taken.");
    }
  };

  return (
    <FormContainer>
      <FormBox>
        <Title>Create Account</Title>

        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Enter Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">Register</Button>
        </form>
      </FormBox>
    </FormContainer>
  );
};

export default Register;
