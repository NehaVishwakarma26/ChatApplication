import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Drawer, Button, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from '../components_temp/Sidebar';
import ChatArea from '../components_temp/ChatArea';
import axios from 'axios';

const { Content } = Layout;

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state for typing status
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to toggle sidebar visibility
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

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <Layout style={styles.layout}>
      <Row style={styles.row}>
        {/* Sidebar for larger screens */}
        <Col
          xs={0} sm={6} lg={6}
          style={styles.sidebarCol}
        >
          <Sidebar setSelectedUserId={setSelectedUserId} />
        </Col>

        {/* Hamburger menu for smaller screens */}
        <div style={styles.hamburgerMenu}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            style={styles.hamburgerIcon}
          />
        </div>

        {/* Chat Area */}
        <Col
          xs={24} sm={18} lg={18}
          style={styles.chatCol}
        >
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

      {/* Sidebar as a Drawer for small screens */}
      <Drawer
        title="Select a User"
        placement="left"
        onClose={toggleSidebar}
        visible={isSidebarVisible}
        width={250}
        bodyStyle={styles.drawerBody}
      >
        <Sidebar setSelectedUserId={setSelectedUserId} />
      </Drawer>
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
    overflowY: 'auto', // Make the sidebar scrollable if content overflows
  },
  hamburgerMenu: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'none', // Hide by default
  },
  hamburgerIcon: {
    fontSize: '24px',
    color: '#fff',
    background: 'none',
    border: 'none',
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
    overflowY: 'auto', // Enable vertical scrolling for chat content
  },
  noChatMessage: {
    textAlign: 'center',
    marginTop: '20%',
    color: '#A9A9A9', // Placeholder text color
  },
  drawerBody: {
    padding: '0 16px',
    backgroundColor: '#2F3A40',
  },
};

export default ChatPage;
