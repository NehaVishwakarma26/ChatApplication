import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import Sidebar from '../components_temp/Sidebar';
import ChatArea from '../components_temp/ChatArea';
import axios from 'axios';

const { Content } = Layout;

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state for typing status
  const userId = sessionStorage.getItem('userId'); // Get the logged-in user ID from sessionStorage

  useEffect(() => {
    console.log('Logged in user ID:', userId);
  }, [userId]);

  useEffect(() => {
    // Fetch the receiver's username when a user is selected for chatting
    const fetchReceiverName = async () => {
      if (selectedUserId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/users/${selectedUserId}`);
          setReceiverName(response.data.username);
        } catch (error) {
          console.error('Error fetching receiver username:', error);
        }
      }
    };

    fetchReceiverName();
  }, [selectedUserId]);

  // Callback to update typing status
  const handleTypingStatus = (status) => {
    setIsTyping(status); // Update typing status from ChatArea
  };

  return (
    <Layout style={styles.layout}>
      <Row style={styles.row}>
        {/* Sidebar */}
        <Col span={6} style={styles.sidebarCol}>
          <Sidebar setSelectedUserId={setSelectedUserId} />
        </Col>

        {/* Chat Area */}
        <Col span={18} style={styles.chatCol}>
          {/* Chat Container */}
          <div style={styles.chatContainer}>
            {/* Chat Header */}
            <div style={styles.header}>
              <Typography.Title level={4} style={styles.headerTitle}>
                {receiverName ? `${receiverName}` : 'Select a user to chat'}
              </Typography.Title>
              {receiverName && (
                <Typography.Text style={styles.headerSubText}>
                  {receiverName ? 'online' : 'offline'}{' '}
                  {isTyping && '(Typing...)'}
                </Typography.Text>
              )}
            </div>

            {/* Chat Content */}
            <div style={styles.chatContent}>
              {selectedUserId ? (
                <ChatArea selectedUserId={selectedUserId} userId={userId} onTypingStatus={handleTypingStatus} />
              ) : (
                <div style={styles.noChatMessage}>
                  <Typography.Text>Select a user to start chatting</Typography.Text>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

const styles = {
  layout: {
    minHeight: '100vh', // Ensure the layout spans the full viewport height
    backgroundColor: '#2F3A40',
    display: 'flex', // Make layout a flex container
    flexDirection: 'row', // Layout the sidebar and chat area side by side
  },
  row: {
    height: '100%', // Full height for the row
    margin: 0,
    display: 'flex',
    flexDirection: 'row', // Keep the sidebar and chat area side by side
    width: '100%',
  },
  sidebarCol: {
    backgroundColor: '#36454F', // Sidebar background
    borderRight: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
    padding: 0,
    height: '100vh', // Make the sidebar occupy the full height
  },
  chatCol: {
    backgroundColor: '#2F3A40', // Chat background
    padding: 0,
    height: '100vh', // Make the chat column occupy the full height
    display: 'flex', // Allows flex-based layout
    flexDirection: 'column',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Fill the column space
    position: 'relative',
    overflow: 'hidden', // Prevent scrolling
  },
  header: {
    backgroundColor: '#36454F',
    padding: '15px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    flexShrink: 0, // Prevent the header from shrinking
  },
  headerTitle: {
    margin: 0,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubText: {
    color: '#A9A9A9', // Status text color
    fontSize: '14px',
  },
  chatContent: {
    flex: 1, // Ensures the chat content fills the remaining space
    padding: '15px 20px',
    overflowY: 'hidden', // Prevent scrolling here as well
  },
  noChatMessage: {
    textAlign: 'center',
    marginTop: '20%',
    color: '#A9A9A9', // Placeholder text color
  },
};

export default ChatPage;
