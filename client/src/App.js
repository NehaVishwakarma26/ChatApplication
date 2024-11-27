// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components_temp/Login';
import Register from './components_temp/Register';
import ChatPage from './Pages/ChatPage';  // Import the ChatPage component

const App = () => {
  const [userId, setUserId] = useState(null);  // To store the user ID
  const navigate = useNavigate();

  const handleLoginSuccess = (id) => {
    setUserId(id);  // Store the user ID in state after login
    navigate('/chat');  // Navigate to the chat page after successful login
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage userId={userId} />} />
      </Routes>
    </div>
  );
};

export default App;
