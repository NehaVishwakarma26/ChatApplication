import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Typography, message } from 'antd';
import { io } from 'socket.io-client';
import axios from 'axios';

const { Text } = Typography;

const socket = io('http://localhost:5000');

const ChatArea = ({ selectedUserId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch messages between sender and receiver
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages?sender=${userId}&receiver=${selectedUserId}`
      );
      setMessages(response.data); // No reverse here, let the order be as it is
    } catch (error) {
      console.error('Error fetching messages:', error);
      message.error('Error fetching messages.');
    }
  };

  // Fetch the receiver's name
  const fetchReceiverName = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/users/${selectedUserId}`);
      setReceiverName(response.data.username);
    } catch (error) {
      console.error('Error fetching receiver name:', error.response || error);
      message.error('Error fetching receiver name.');
    }
  };

  useEffect(() => {
    if (userId) {
      socket.emit('join', userId);
    }

    if (selectedUserId) {
      fetchMessages();
      fetchReceiverName();
    }

    // User online/offline status handling
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

    // Typing status event handlers
    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [userId, selectedUserId]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      message.warning('Message cannot be empty.');
      return;
    }

    const msgData = {
      sender: userId,
      receiver: selectedUserId,
      content: newMessage,
      timestamp: new Date(),
    };

    // Emit "sendMessage" and then update state
    socket.emit('sendMessage', msgData);

    // Emit "stopTyping" after sending the message
    socket.emit('stopTyping', { sender: userId, receiver: selectedUserId });

    // Only update state after message is sent
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userId, receiver: selectedUserId, content: newMessage, timestamp: msgData.timestamp },
    ]);

    // Clear input field
    setNewMessage('');
    scrollToBottom(); // Scroll to bottom after sending a message
  };

  // Handle typing event and emit "typing" status
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Emit "typing" event
    socket.emit('typing', { sender: userId, receiver: selectedUserId });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit "stopTyping" if no typing occurs for 1 second
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { sender: userId, receiver: selectedUserId });
    }, 1000);
  };

  // Scroll to bottom of the message area
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      // Ensure the message is relevant to the current chat
      if (
        (msg.sender === userId && msg.receiver === selectedUserId) ||
        (msg.sender === selectedUserId && msg.receiver === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to the end
        scrollToBottom(); // Scroll to bottom when new message is received
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [userId, selectedUserId]);

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
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
                ...styles.bubble,
                backgroundColor: msg.sender === userId ? '#4CAF50' : '#3E4E56',
                color: '#fff',
              }}
            >
              <Text>{msg.content}</Text>
              <div style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
        {isTyping && <div style={styles.typingIndicator}>{`${receiverName} is typing...`}</div>}
      </div>

      <div style={styles.inputContainer}>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          style={styles.input}
        />
        <Button type="primary" onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#2F3A40',
    color: '#fff',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px 20px',
    backgroundColor: '#2F3A40',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  bubble: {
    display: 'inline-block',
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  timestamp: {
    fontSize: '12px',
    color: '#D3D3D3',
    marginTop: '5px',
    textAlign: 'right',
  },
  typingIndicator: {
    fontSize: '14px',
    color: '#A9A9A9',
    margin: '10px 0',
    textAlign: 'left',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px 20px',
  },
  input: {
    flex: 1,
    marginRight: '10px',
    borderRadius: '20px',
    padding: '10px 16px',
    backgroundColor: '#3E4E56',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '20px',
    padding: '10px 16px',
  },
};

export default ChatArea;
