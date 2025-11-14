import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

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
  border-radius: 22px;
  backdrop-filter: blur(14px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.10),
    0 8px 18px rgba(0, 0, 0, 0.06);

  animation: slideUp 0.8s ease;
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(25px); }
    to { opacity: 1; transform: translateY(0); }
  }

  transition: 0.35s ease;
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
  margin-bottom: 35px;

  animation: fadeDown 0.7s ease;
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 14px;

  border-radius: 12px;
  border: 1.4px solid #ccc;
  background: #fafafa;

  font-size: 1rem;
  outline: none;
  transition: 0.25s ease;

  &:focus {
    border-color: #8c5eff;
    box-shadow: 0 0 12px rgba(140, 94, 255, 0.25);
    background: white;
  }

  &:hover {
    border-color: #b389ff;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -10px;
    left: 10px;
    font-size: 0.8rem;
    color: #7c59dd;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 14px;
  left: 15px;
  font-size: 1rem;
  color: #777;
  pointer-events: none;
  transition: 0.28s ease;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 5px;

  border: none;
  border-radius: 12px;

  background: linear-gradient(135deg, #9b4dff, #6a4fff);
  color: white;

  font-size: 1.15rem;
  font-weight: 600;

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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <FormContainer>
      <FormBox>
        <Title>Welcome Back</Title>

        <form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="text"
              placeholder=" "
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FloatingLabel>Username</FloatingLabel>
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FloatingLabel>Password</FloatingLabel>
          </InputWrapper>

          <Button type="submit">Login</Button>
        </form>
      </FormBox>
    </FormContainer>
  );
};

export default Login;
