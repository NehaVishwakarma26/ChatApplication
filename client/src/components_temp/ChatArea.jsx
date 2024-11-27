import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { io } from 'socket.io-client';
import axios from 'axios';

const { Text } = Typography;

const socket = io('http://localhost:5000'); // Connect to the Socket.IO server

const ChatArea = ({ selectedUserId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const messageEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages?sender=${userId}&receiver=${selectedUserId}`
      );
      setMessages(response.data.reverse()); // Reverse to show recent messages at the bottom
    } catch (error) {
      console.error('Error fetching messages:', error);
      message.error('Error fetching messages.');
    }
  };

  const fetchReceiverName = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/users/${selectedUserId}`);
      setReceiverName(response.data.username); // Set the receiver's name
    } catch (error) {
      console.error('Error fetching receiver name:', error.response || error);
      message.error('Error fetching receiver name.');
    }
  };

  useEffect(() => {
    if (userId) {
      // Join the room with the logged-in user's ID
      socket.emit('join', userId);
    }

    if (selectedUserId) {
      fetchMessages();
      fetchReceiverName();
    }

    // Listen for online/offline status changes
    const handleUserOnline = (userId) => {
      if (userId === selectedUserId) {
        setOnlineStatus('online');
      }
    };

    const handleUserOffline = (userId) => {
      if (userId === selectedUserId) {
        setOnlineStatus('offline');
      }
    };

    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);

    return () => {
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
    };
  }, [userId, selectedUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      message.warning('Message cannot be empty.');
      return;
    }

    const msgData = {
      sender: userId,
      receiver: selectedUserId,
      content: newMessage,
      timestamp: new Date(), // Add timestamp when sending message
    };

    // Emit the message to the server and notify both sender and receiver
    socket.emit('sendMessage', msgData);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userId, receiver: selectedUserId, content: newMessage, timestamp: msgData.timestamp },
    ]);

    setNewMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for new messages from the server (this handles receiving messages in real-time)
    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender === userId && msg.receiver === selectedUserId) ||
        (msg.sender === selectedUserId && msg.receiver === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, msg]);
        scrollToBottom();
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [userId, selectedUserId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '60px', // Added enough margin to keep space for input at the bottom
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === userId ? 'right' : 'left',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: msg.sender === userId ? '#4CAF50' : '#729999', // Sender: light green, Receiver: dark green
                color: msg.sender === userId ? '#fff' : '#fff', // White text for both sender and receiver
                maxWidth: '70%',
                wordWrap: 'break-word',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Text>{msg.content}</Text>
              <div
                style={{
                  fontSize: '12px',
                  color: '#D3D3D3', // Very light grey for timestamp
                  marginTop: '5px',
                  textAlign: 'right',
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input and Send Button */}
      <div
        style={{
          position: 'sticky',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '10px 20px',
          backgroundColor: '#fff',
          borderTop: '2px solid #eaeaea',
          display: 'flex',
          alignItems: 'center',
          zIndex: '1', // Ensure it stays on top of chat messages
        }}
      >
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            marginRight: '10px',
            borderRadius: '50px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px 16px',
          }}
        />
     <Button
  type="primary"
  onClick={handleSendMessage}
  style={{
    backgroundColor: '#4CAF50',  
    borderColor: '#4CAF50',      
    borderRadius: '50px',
    padding: '8px 16px',
  }}
>
  Send
</Button>
      </div>
    </div>
  );
};

export default ChatArea;
