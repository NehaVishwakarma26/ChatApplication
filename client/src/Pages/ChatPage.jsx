import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from '../components_temp/Sidebar';
import ChatArea from '../components_temp/ChatArea';
import axios from 'axios';
import { API_BASE_URL } from '../components_temp/config'; // Import the base URL from config

const { Content } = Layout;

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); // Array to store online user IDs
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    console.log('Logged in user ID:', userId);
  }, [userId]);

  useEffect(() => {
    // Fetch the receiver's username when a user is selected
    const fetchReceiverName = async () => {
      if (selectedUserId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/users/${selectedUserId}`);
          setReceiverName(response.data.username); // Update the state with the username
        } catch (error) {
          console.error('Error fetching receiver username:', error);
        }
      }
    };
    fetchReceiverName();
  }, [selectedUserId]);

  useEffect(() => {
    // Fetch online users periodically
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/onlineUsers`);
        setOnlineUsers(response.data); // Update online user IDs
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };

    fetchOnlineUsers();
    const intervalId = setInterval(fetchOnlineUsers, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const isUserOnline = onlineUsers.includes(selectedUserId); // Check if the selected user is online

  return (
    <Layout style={styles.layout}>
      <Row style={styles.row}>
        {/* Sidebar for larger screens */}
        <Col xs={0} sm={6} lg={6} style={styles.sidebarCol}>
          <Sidebar setSelectedUserId={setSelectedUserId} />
        </Col>

        {/* Hamburger menu for smaller screens */}
        <div style={styles.hamburgerMenu}>
          <Button type="text" icon={<MenuOutlined />} onClick={toggleSidebar} style={styles.hamburgerIcon} />
        </div>

        {/* Chat Area */}
        <Col xs={24} sm={18} lg={18} style={styles.chatCol}>
          <div style={styles.chatContainer}>
            {/* Chat Header */}
            <div style={styles.header}>
              <Typography.Title level={4} style={styles.headerTitle}>
                {receiverName ? receiverName : 'Select a user to chat'}
              </Typography.Title>
              {receiverName && (
                <Typography.Text style={styles.headerSubText}>
                  {isUserOnline ? 'Online' : 'Offline'}
                </Typography.Text>
              )}
            </div>

            {/* Chat Content */}
            <div style={styles.chatContent}>
              {selectedUserId ? (
                <ChatArea selectedUserId={selectedUserId} userId={userId} />
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
    height: '100vh',
    backgroundColor: '#2F3A40',
  },
  row: {
    height: '100%',
  },
  sidebarCol: {
    backgroundColor: '#2F3A40',
    borderRight: '1px solid #ddd',
    height: '100%',
    overflowY: 'auto',
  },
  chatCol: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#2F3A40',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#2F3A40',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#ffffff',
  },
  headerSubText: {
    fontSize: '12px',
    color: '#999',
  },
  chatContent: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#2F3A40',
  },
  noChatMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#888',
  },
  hamburgerMenu: {
    display: 'none',
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 10,
  },
  hamburgerIcon: {
    fontSize: '18px',
    color: '#000',
  },
  drawerBody: {
    padding: '0',
  },
};

export default ChatPage;
