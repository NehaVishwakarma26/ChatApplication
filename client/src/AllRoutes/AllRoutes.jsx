// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components_temp/Login';
import Register from './components_temp/Register';
import ChatPage from './pages/ChatPage';  // Import the ChatPage component

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage userId="1" />} />  {/* Pass the userId as a prop */}
      </Routes>
    </div>
  );
};

export default App;
