import React, { useState } from 'react';
import { Input, Button, Form, message, Card, Typography } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('https://chatapplication-x3vq.onrender.com/api/auth/register', { username, email, password });
      message.success('Registration successful! Redirecting...');
      window.location.href = '/';
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto', paddingTop: '60px' }}>
      <Card
        title="Register"
        style={{
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Form onFinish={handleRegister}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ borderRadius: '8px', padding: '10px' }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: '8px', padding: '10px' }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: '8px', padding: '10px' }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: 'bold',
              marginTop: '20px',
            }}
          >
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
