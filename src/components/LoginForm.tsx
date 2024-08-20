import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  user_acc_id: string; 
}

const decodeJwtToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(
        'https://f502-14-194-85-214.ngrok-free.app/api/login',
        formData
      );

      const token = response.data as string;
      
      const decodedToken = decodeJwtToken(token);

      if (decodedToken) {
        const userId = decodedToken.user_acc_id;
        login(token, username, userId);
        setMessage('Login Successful');
        navigate('/mypage')
      } else {
        setMessage('Login Unsuccessful: Username/Password is invalid!');
      }
    } catch (error: any) {
      setMessage('Login failed: ' + error.response.data);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <button
        type="submit"
        className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Login
      </button>
      <p className="text-center">{message}</p>
    </form>
  );
};

export default LoginForm;
