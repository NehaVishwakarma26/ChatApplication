import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography } from 'antd'; // Ensure Typography is imported
import Sidebar from '../components_temp/Sidebar';  // Adjust path as needed
import ChatArea from '../components_temp/ChatArea'; // Adjust path as needed
import axios from 'axios';

const { Content } = Layout;

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Row style={{ height: '100%', margin: 0 }} gutter={0}> {/* Remove margin/padding here */}
        {/* Sidebar */}
        <Col span={6} style={{ backgroundColor: '#ffffff', borderRight: '1px solid #eaeaea', padding: 0 }}> {/* Set padding to 0 */}
          <Sidebar setSelectedUserId={setSelectedUserId} />
        </Col>

        {/* Chat Area */}
        <Col span={18} style={{ display: 'flex', flexDirection: 'column', padding: '0' }}> {/* Set padding to 0 */}
          {/* Chat Header */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '10px 20px',
              borderBottom: '2px solid #eaeaea',
              position: 'sticky',
              top: '0',
              zIndex: '1',
            }}
          >
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
              {receiverName ? `Chat with ${receiverName}` : 'Select a user to chat'}
            </Typography.Title>
            {receiverName && (
              <Typography.Text style={{ color: '#999', fontSize: '14px' }}>
                {receiverName} is {receiverName ? 'online' : 'offline'}
              </Typography.Text>
            )}
          </div>

          {/* Chat Content */}
          <Content style={{ flex: 1, padding: '0', overflowY: 'auto' }}> {/* Set padding to 0 */}
            {selectedUserId ? (
              <ChatArea selectedUserId={selectedUserId} userId={userId} />
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <Typography.Text>Select a user to start chatting</Typography.Text>
              </div>
            )}
          </Content>
        </Col>
      </Row>
    </Layout>
  );
};

export default ChatPage;
