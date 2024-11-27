import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Spin } from 'antd';
import axios from 'axios';

// The Sidebar component will now be fixed to the left and look more modern.
const Sidebar = ({ setSelectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's ID from sessionStorage
  const loggedInUserId = sessionStorage.getItem('userId');

  // Fetch all users except the logged-in user
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users');
      const filteredUsers = response.data.filter(user => user._id !== loggedInUserId); // Exclude logged-in user
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

  return (
    <div style={styles.sidebarContainer}>
      <Typography.Title level={3} style={{ color: '#fff' }}>Contacts</Typography.Title>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user._id} style={styles.listItem}>
              <Button block onClick={() => setSelectedUserId(user._id)} style={styles.button}>
                {user.username}
              </Button>
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
    backgroundColor: '#729999',  // Dark teal background for the sidebar
    color: '#fff',  // White text color for better contrast
    position: 'fixed',
    top: 0,
    left: 0,
    width: '260px',
    height: '100vh',  // Full height
    padding: '20px',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',  // Slight shadow to create depth
    zIndex: 100,
  },
  listItem: {
    marginBottom: '3px',
  },
  button: {
    borderRadius: '5px',
    backgroundColor: '#4CAF50',  // Green background for buttons
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',  // Smooth transition effect
  },
};

export default Sidebar;
