import React, { useState, useEffect } from 'react';
import { List, Typography, Spin, Avatar } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';

const Sidebar = ({ setSelectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's details from sessionStorage
  const loggedInUserId = sessionStorage.getItem('userId');
  const loggedInUsername = sessionStorage.getItem('username'); // Assuming username is stored

  // Fetch all users except the logged-in user
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://chatapplication-x3vq.onrender.com/api/auth/users');
      const filteredUsers = response.data.filter((user) => user._id !== loggedInUserId); // Exclude logged-in user
      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Clear sessionStorage and redirect to login page
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={styles.sidebarContainer}>
      {/* Profile Section */}
      <div style={styles.profileSection}>
        <div style={styles.profileDetails}>
          <Avatar style={styles.avatar} icon={<UserOutlined />} />
          <div>
            <Typography.Text style={styles.username}>{loggedInUsername}</Typography.Text>
          </div>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.contactHeader}>
        <Typography.Title level={4} style={styles.headerTitle}>
          Chats
        </Typography.Title>
      </div>

      {loading ? (
        <Spin tip="Loading..." style={styles.loadingSpinner} />
      ) : (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              key={user._id}
              onClick={() => setSelectedUserId(user._id)}
              style={styles.contactItem}
            >
              <Avatar style={styles.contactAvatar} icon={<UserOutlined />} />
              <div style={styles.contactInfo}>
                <Typography.Text style={styles.contactName}>{user.username}</Typography.Text>
                <Typography.Text style={styles.contactMessagePreview}>
                  Tap to chat
                </Typography.Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

// Sidebar style adjustments
const styles = {
  sidebarContainer: {
    backgroundColor: '#1E272E', // Darker color for a modern look
    color: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '380px', // Increased width
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)', // Slight shadow to create depth
    overflow: 'hidden',
  },
  profileSection: {
    backgroundColor: '#2F3A40',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    backgroundColor: '#4CAF50', // Green avatar for profile
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#FF4D4F', // Red logout button
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  contactHeader: {
    backgroundColor: '#2F3A40',
    padding: '10px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  loadingSpinner: {
    textAlign: 'center',
    marginTop: '20px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'background-color 0.3s ease',
    backgroundColor: '#1E272E',
  },
  contactAvatar: {
    backgroundColor: '#4CAF50',
    marginRight: '15px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column', // Stack the name and "Tap to chat" vertically
    alignItems: 'flex-end', // Align everything to the right
    marginLeft: 'auto', // Pushes the entire contactInfo block to the extreme right
  },
  contactName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  contactMessagePreview: {
    color: '#aaa',
    fontSize: '12px',
  },
};

export default Sidebar;
