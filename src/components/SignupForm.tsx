import React, { useState } from 'react';
import axios from 'axios';

interface SignupFormProps {
  switchToLogin: () => void; 
}

const SignupForm: React.FC<SignupFormProps> = ({ switchToLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confpassword, setConfpassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confpassword) {
      setMessage("Passwords don't match!");
      return;
    }
    console.log(username, password);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      const response = await axios.post("https://f502-14-194-85-214.ngrok-free.app/api/signup", formData);
      console.log(response.data);
      setMessage('Signup successful');
      setUsername('');
      setPassword('');
      setConfpassword('');
      switchToLogin(); 
    } catch (error: any) {
      setMessage("Signup Failed: " + error.response.data);
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <input
        id="password-input"
        type="password"
        placeholder="Confirm Password"
        value={confpassword}
        required
        onChange={(e) => setConfpassword(e.target.value)}
        className="mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <button
        type="submit"
        className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Sign Up
      </button>
      <p className='text-center'>{message}</p>
    </form>
  );
}

export default SignupForm;
