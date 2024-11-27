import React, { useState } from 'react';
import { Input, Button, Form, message, Card, Typography, Space } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('userId', response.data.userId);
      sessionStorage.setItem('username', response.data.username);

      message.success('Login successful! Redirecting...');
      window.location.href = '/chat'; // Redirect to chat page after successful login
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto', paddingTop: '60px' }}>
      <Card
        title="Login"
        style={{
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Form onFinish={handleLogin}>
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
            Login
          </Button>
        </Form>

        <Space style={{ marginTop: '10px' }}>
          <Text style={{ color: '#555' }}>Don't have an account?</Text>
          <Link to="/register" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
            Register
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
